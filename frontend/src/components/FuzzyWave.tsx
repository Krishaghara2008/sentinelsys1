/**
 * Renders the three overlapping triangular membership functions
 * (Low / Normal / High style) as a faint background motif — the same
 * shape of curve skfuzzy's trimf() produces for every variable in the
 * engine. Used sparingly as SentinelSys's signature visual element.
 */
export default function FuzzyWave({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polyline
        points="0,120 0,120 150,10 300,120 300,120"
        fill="none"
        stroke="#2DD9E8"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <polyline
        points="150,120 220,120 300,10 380,120 450,120"
        fill="none"
        stroke="#8B7CF6"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <polyline
        points="350,120 450,120 600,10 600,10"
        fill="none"
        stroke="#F5924C"
        strokeWidth="1.5"
        opacity="0.25"
      />
    </svg>
  );
}
