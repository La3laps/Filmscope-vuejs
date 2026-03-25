export async function getMovieTrailers(movieId: number) {
  const res = await fetch(
    `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`,
  )

  if (!res.ok) {
    throw new Error('Failed to fetch trailers')
  }

  const data = await res.json()

  // Optional: only return YouTube trailers
  return data.results.filter(
    (video: { type: string; site: string }) => video.type === 'Trailer' && video.site === 'YouTube',
  )
}
