interface CastListProps {
  cast: string[];
}

export default function CastList({ cast }: CastListProps) {
  if (!cast.length) {
    return <p className="muted">Cast data unavailable.</p>;
  }

  return (
    <ul className="cast-list">
      {cast.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
