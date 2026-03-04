export default function LoadingSkeleton() {
  return (
    <div className="movie-card skeleton">
      <div className="poster-skeleton shimmer" />
      <div className="content-skeleton">
        <div className="line shimmer" />
        <div className="line short shimmer" />
        <div className="line shimmer" />
        <div className="line shimmer" />
      </div>
    </div>
  );
}
