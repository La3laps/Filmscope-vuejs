export type Movie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  total_pages: number
  release_date?: string
  vote_average?: number
  youtube_id?: string
}
