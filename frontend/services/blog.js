// Fungsi-fungsi bantuan (bukan data, bukan halaman) untuk fitur blog.
// Data artikelnya sendiri tetap di app/donatur/blog/blogData.js.
import { POSTS } from '@/app/donatur/blog/blogData'

export function getPostBySlug(slug) {
  return POSTS.find((post) => post.slug === slug)
}
