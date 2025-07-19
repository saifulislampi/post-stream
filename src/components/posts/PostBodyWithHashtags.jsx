//PostBodyWithHashtags.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Renders up to 10 hashtags as clickable links to /hashtag/:tag
export default function PostBodyWithHashtags({ body, hashtags = [] }) {
  if (!body) return null;
  return (
    <span>
      {body.split(/(\s+)/).map((word, idx) => {
        // Only match alphanumeric hashtag portion (align with extraction)
        const match = word.match(/^#(\w+)/);
        if (match) {
          const tag = match[1].toLowerCase();
          if (hashtags.includes(tag)) {
            return (
              <Link
                key={idx}
                to={`/hashtag/${tag}`}
                className="text-decoration-none text-primary"
              >
                {word}
              </Link>
            );
          }
        }
        return <span key={idx}>{word}</span>;
      })}
    </span>
  );
}
// This component takes a post body and an array of hashtags,
// and renders the body with hashtags as clickable links.
// Hashtags are linked to an explore page with the hashtag as a query parameter.
// It uses the `text-decoration-none` and `text-primary` classes for styling.
// The `text-decoration-none` class removes the underline from links,
// and `text-primary` applies the primary color (usually blue) to the links.  