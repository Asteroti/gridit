#!/usr/bin/env bash
# CSS health audit: unused tokens, raw colors outside :root, inconsistent breakpoints.
# Exit code 0 always — this is informational, not enforcing.
set -uo pipefail

CSS=public/styles.css
ELM=public/src/Main.elm

echo "=== Design tokens ==="
TOKENS=$(awk '/^  --/{gsub(/:.*/,""); gsub(/^  /,""); print}' "$CSS")
TOTAL=$(echo "$TOKENS" | wc -l | tr -d ' ')
UNUSED=$(while IFS= read -r tok; do
  count=$(grep -c "var($tok)" "$CSS" || true)
  if [ "$count" = "0" ]; then echo "  $tok"; fi
done <<< "$TOKENS")
UNUSED_COUNT=$(echo -n "$UNUSED" | grep -c '^  ' || true)
echo "  $TOTAL total, $UNUSED_COUNT unused"
if [ "$UNUSED_COUNT" -gt 0 ]; then
  echo "$UNUSED"
fi

echo
echo "=== Raw colors outside :root ==="
RAW=$(awk '
  /:root \{/ { in_root = 1; next }
  in_root && /^\}/ { in_root = 0; next }
  !in_root && /(rgba?\(|hsla?\()/ {
    if ($0 !~ /data:image/ && $0 !~ /^  --/) print NR": "$0
  }
' "$CSS")
RAW_COUNT=$(echo -n "$RAW" | grep -c '^' || true)
echo "  $RAW_COUNT raw color literals"

echo
echo "=== Breakpoints ==="
grep -oE '@media \([^)]+\)' "$CSS" | sort | uniq -c | sed 's/^/  /'

echo
echo "=== Inline styles in Elm ==="
INLINE=$(grep -nE 'style "' "$ELM" | grep -v 'background-color' || true)
INLINE_COUNT=$(echo -n "$INLINE" | grep -c '^' || true)
echo "  $INLINE_COUNT non-data-driven inline styles (data-driven background-color excluded)"
if [ "$INLINE_COUNT" -gt 0 ]; then
  echo "$INLINE" | sed 's/^/  /'
fi
