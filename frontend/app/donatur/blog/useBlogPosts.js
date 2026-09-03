'use client'

// Artikel Blog & Kursus kini punya tabel khusus `blog_posts` di backend
// dengan CRUD penuh. Hook + klien API-nya ada di services/blog.js — file ini
// hanya meneruskannya supaya import lama tetap jalan.
export { useBlogPosts, fetchPost } from '@/services/blog'
