export default function Logo({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 V50 C90 75 50 95 50 95 C50 95 10 75 10 50 V20 L50 5 Z" fill="#2E7D32"/>
      <path d="M50 12 L82 24 V48 C82 68 50 85 50 85 C50 85 18 68 18 48 V24 L50 12 Z" fill="#E8F5E9"/>
      <path d="M50 16 L76 26 V48 C76 64 50 78 50 78 C50 78 24 64 24 48 V26 L50 16 Z" fill="#2E7D32"/>
      <path d="M40 35 Q50 30 60 35 Q65 50 60 65 Q50 70 40 65 Q35 50 40 35 Z" fill="#E8F5E9"/>
      <path d="M45 45 L55 45 L50 55 Z" fill="#2E7D32"/>
      <circle cx="43" cy="42" r="2" fill="#2E7D32"/>
      <circle cx="57" cy="42" r="2" fill="#2E7D32"/>
      <path d="M40 50 Q50 60 60 50" stroke="#2E7D32" strokeWidth="2" fill="none"/>
    </svg>
  );
}
