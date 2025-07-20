import React, { useState, useEffect } from "react";
import Spinner from "./Spinner.jsx";
import Avatar from "./Avatar.jsx";
import { searchHashtags } from "../../services/hashtags.js";
import { searchProfiles } from "../../services/profiles.js";
import "./SearchAutocomplete.css";

export default function SearchAutocomplete({ searchTerm, onHashtagSelect, onUserSelect }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const load = async () => {
      if (!searchTerm) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        if (searchTerm.startsWith("#")) {
          const prefix = searchTerm.slice(1);
          const tags = await searchHashtags(prefix, 10);
          if (!signal.aborted) setOptions(tags.map(t => t.name));
        } else if (searchTerm.startsWith("@")) {
          const prefix = searchTerm.slice(1);
          const users = await searchProfiles(prefix);
          if (!signal.aborted) setOptions(users);
        } else {
          setOptions([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [searchTerm]);

  if (!searchTerm.startsWith("#") && !searchTerm.startsWith("@")) return null;

  return (
    <div className="autocomplete-dropdown">
      {loading ? (
        <div className="autocomplete-loading">
          <Spinner size="sm" />
        </div>
      ) : (
        options.map((opt, idx) => (
          <div
            key={idx}
            className="autocomplete-item"
            onMouseDown={() => {
              if (searchTerm.startsWith("#")) onHashtagSelect(opt);
              else onUserSelect(opt);
            }}
          >
            {searchTerm.startsWith("#") ? `#${opt}` : (
              <div className="d-flex align-items-center">
                <Avatar profile={opt} size={32} className="me-2" />
                <div>
                  <div className="fw-bold text-dark">
                    {opt.firstName && opt.lastName 
                      ? `${opt.firstName} ${opt.lastName}` 
                      : opt.firstName || opt.lastName || "Unknown User"
                    }
                  </div>
                  <div className="text-muted small">@{opt.username}</div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
