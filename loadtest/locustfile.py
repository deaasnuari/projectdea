"""Uji performa LAZIS PLN Batam dengan Locust.

Yang diuji (hanya BACA, tidak membuat/mengubah data):
  - PublicSite : halaman publik di frontend (Next.js, port 3000)
  - PublicApi  : API publik di backend (Express, port 3001)
  - AdminApi   : API admin setelah login (OPSIONAL, hanya jika ADMIN_USER/ADMIN_PASS diisi)

Yang SENGAJA tidak diuji beban: kirim donasi, kirim pesan kontak, CAPTCHA, dan login massal.
Semuanya dibatasi rate limit per IP (donasi 5/menit, kontak 2/menit, CAPTCHA 30/menit,
login 40 per 15 menit) dan semua pengguna Locust datang dari satu IP, jadi hasilnya hanya
429 dan menyesatkan. Rate limit itu sendiri sudah diuji di tes keamanan.

Jalankan frontend dalam mode production (npm run dev di proyek ini sudah begitu:
next build && next start). Jangan uji beban terhadap `next dev`, hasilnya tidak mewakili.

PENTING - batas umum API: seluruh API dibatasi 300 request/menit per IP. Locust dan server
frontend memakai satu IP, jadi batas itu cepat habis dan sisanya dapat 429 (itu rate limit yang
bekerja, bukan aplikasi yang lambat). Untuk mengukur kapasitas, jalankan backend SEMENTARA dengan:
  $env:API_RATE_LIMIT="100000"; npm run dev      (di folder backend)
lalu tutup terminal itu setelah selesai supaya batas kembali 300. Jangan dipakai di production.

Contoh:
  # tampilan web (http://localhost:8089)
  locust -f loadtest/locustfile.py

  # tanpa tampilan, 30 pengguna, naik 5/detik, 2 menit, simpan laporan
  locust -f loadtest/locustfile.py --headless -u 30 -r 5 -t 2m --html loadtest/laporan.html --csv loadtest/hasil

Variabel lingkungan (opsional):
  FE_HOST    alamat frontend  (default http://localhost:3000)
  API_HOST   alamat backend   (default http://localhost:3001)
  ADMIN_USER / ADMIN_PASS  akun admin UJI untuk menguji API admin (jangan pakai akun asli)
  P95_MS     batas p95 yang dianggap lulus, ms   (default 800)
  MAX_FAIL   batas rasio gagal yang dianggap lulus (default 0.01 = 1%)
"""
import os
import random

from locust import HttpUser, between, events, task

FE_HOST = os.getenv("FE_HOST", "http://localhost:3000")
API_HOST = os.getenv("API_HOST", "http://localhost:3001")
ADMIN_USER = os.getenv("ADMIN_USER", "")
ADMIN_PASS = os.getenv("ADMIN_PASS", "")
P95_MS = float(os.getenv("P95_MS", "800"))
MAX_FAIL = float(os.getenv("MAX_FAIL", "0.01"))

# Origin sah supaya lolos pengecekan CORS/CSRF backend (dipakai juga untuk login admin).
ORIGIN = {"Origin": "http://localhost:3000"}


class PublicSite(HttpUser):
    """Pengunjung yang membuka halaman situs donatur."""

    host = FE_HOST
    weight = 6
    wait_time = between(1, 4)

    def on_start(self):
        api = self.environment.api_probe
        self.programs = api["programs"]
        self.posts = api["posts"]
        self.pages = api["pages"]

    @task(5)
    def beranda(self):
        self.client.get("/donatur", name="FE /donatur")

    @task(4)
    def daftar_program(self):
        self.client.get("/donatur/program", name="FE /donatur/program")

    @task(3)
    def detail_program(self):
        if self.programs:
            self.client.get(f"/donatur/program/{random.choice(self.programs)}", name="FE /donatur/program/[id]")

    @task(3)
    def daftar_blog(self):
        self.client.get("/donatur/blog", name="FE /donatur/blog")

    @task(2)
    def detail_blog(self):
        if self.posts:
            self.client.get(f"/donatur/blog/{random.choice(self.posts)}", name="FE /donatur/blog/[slug]")

    @task(2)
    def tentang_kami(self):
        self.client.get("/donatur/tentang-kami", name="FE /donatur/tentang-kami")

    @task(1)
    def kontak_kami(self):
        self.client.get("/donatur/kontak-kami", name="FE /donatur/kontak-kami")

    @task(1)
    def halaman_menu(self):
        if self.pages:
            self.client.get(f"/donatur/{random.choice(self.pages)}", name="FE /donatur/[slug]")

    @task(1)
    def login_page(self):
        self.client.get("/login", name="FE /login")


class PublicApi(HttpUser):
    """Klien yang memanggil API publik (yang dipakai halaman donatur di browser)."""

    host = API_HOST
    weight = 4
    wait_time = between(0.5, 2)

    def on_start(self):
        api = self.environment.api_probe
        self.programs = api["programs"]
        self.posts = api["posts"]

    @task(5)
    def home(self):
        self.client.get("/api/home", name="API /api/home", headers=ORIGIN)

    @task(4)
    def programs(self):
        self.client.get("/api/programs", name="API /api/programs", headers=ORIGIN)

    @task(2)
    def program_summary(self):
        self.client.get("/api/programs/summary", name="API /api/programs/summary", headers=ORIGIN)

    @task(3)
    def program_detail(self):
        if self.programs:
            self.client.get(f"/api/programs/{random.choice(self.programs)}", name="API /api/programs/[slug]", headers=ORIGIN)

    @task(3)
    def blog(self):
        self.client.get("/api/blog", name="API /api/blog", headers=ORIGIN)

    @task(2)
    def blog_detail(self):
        if self.posts:
            self.client.get(f"/api/blog/{random.choice(self.posts)}", name="API /api/blog/[slug]", headers=ORIGIN)

    @task(3)
    def menus(self):
        self.client.get("/api/menus", name="API /api/menus", headers=ORIGIN)

    @task(2)
    def text_elements(self):
        self.client.get("/api/text-elements", name="API /api/text-elements", headers=ORIGIN)

    @task(1)
    def info_lain(self):
        path = random.choice(["/api/about", "/api/contact", "/api/team", "/api/donor-info", "/api/bank-accounts", "/api/donation-types"])
        self.client.get(path, name="API /api/[info]", headers=ORIGIN)

    @task(1)
    def health(self):
        self.client.get("/api/health", name="API /api/health")


if ADMIN_USER and ADMIN_PASS:

    class AdminApi(HttpUser):
        """Admin yang sudah login membuka daftar data (hanya GET). Aktif jika ADMIN_USER/ADMIN_PASS diisi."""

        host = API_HOST
        weight = 1
        wait_time = between(2, 6)

        def on_start(self):
            # Satu login per pengguna virtual; batas login 40 per 15 menit per IP,
            # jadi pakai jumlah pengguna (-u) kecil dan jangan ulangi tes berkali-kali.
            with self.client.post(
                "/api/auth/login",
                json={"username": ADMIN_USER, "password": ADMIN_PASS},
                headers=ORIGIN,
                name="API POST /api/auth/login",
                catch_response=True,
            ) as r:
                if r.status_code != 200:
                    r.failure(f"login admin gagal: {r.status_code} {r.text[:80]}")
                    self.environment.runner.quit()
                else:
                    r.success()

        @task(4)
        def donasi(self):
            self.client.get("/api/donations", name="ADMIN /api/donations", headers=ORIGIN)

        @task(3)
        def donasi_stats(self):
            self.client.get("/api/donations/stats", name="ADMIN /api/donations/stats", headers=ORIGIN)

        @task(2)
        def pesan(self):
            self.client.get("/api/contact-messages", name="ADMIN /api/contact-messages", headers=ORIGIN)

        @task(1)
        def menu_admin(self):
            self.client.get("/api/menus/all", name="ADMIN /api/menus/all", headers=ORIGIN)

        @task(1)
        def me(self):
            self.client.get("/api/auth/me", name="ADMIN /api/auth/me", headers=ORIGIN)


@events.test_start.add_listener
def probe(environment, **_):
    """Sebelum tes mulai: ambil slug nyata dari API, dan pastikan server hidup."""
    import requests

    environment.api_probe = {"programs": [], "posts": [], "pages": []}
    try:
        requests.get(f"{API_HOST}/api/health", timeout=5).raise_for_status()
    except Exception as e:  # noqa: BLE001
        environment.runner.quit()
        raise SystemExit(f"Backend tidak bisa dihubungi di {API_HOST}: {e}")
    try:
        requests.get(f"{FE_HOST}/login", timeout=10).raise_for_status()
    except Exception as e:  # noqa: BLE001
        environment.runner.quit()
        raise SystemExit(f"Frontend tidak bisa dihubungi di {FE_HOST}: {e}")

    s = requests.Session()
    s.headers.update(ORIGIN)

    def get(path):
        try:
            return s.get(API_HOST + path, timeout=10).json()
        except Exception:  # noqa: BLE001
            return {}

    environment.api_probe["programs"] = [x["slug"] for x in get("/api/programs").get("data", []) if x.get("slug")]
    environment.api_probe["posts"] = [x["slug"] for x in get("/api/blog").get("data", []) if x.get("slug")]

    out = []

    def walk(nodes):
        for n in nodes or []:
            if n.get("slug") and n.get("templateType") != "system":
                out.append(n["slug"])
            walk(n.get("children"))

    body = get("/api/menus")
    walk(body.get("data", []) if isinstance(body, dict) else body)
    environment.api_probe["pages"] = out
    print(
        f"[probe] program={len(environment.api_probe['programs'])} "
        f"blog={len(environment.api_probe['posts'])} halaman-menu={len(out)} "
        f"admin={'ya' if ADMIN_USER and ADMIN_PASS else 'tidak'}"
    )


@events.quitting.add_listener
def quality_gate(environment, **_):
    """Beri kode keluar 1 jika tes tidak lulus (berguna untuk CI)."""
    t = environment.stats.total
    if t.num_requests == 0:
        return
    p95 = t.get_response_time_percentile(0.95)
    fail_ratio = t.fail_ratio
    ok = True
    if fail_ratio > MAX_FAIL:
        print(f"[GAGAL] rasio gagal {fail_ratio:.2%} > batas {MAX_FAIL:.2%}")
        ok = False
    if p95 and p95 > P95_MS:
        print(f"[GAGAL] p95 {p95:.0f} ms > batas {P95_MS:.0f} ms")
        ok = False
    if ok:
        print(f"[LULUS] gagal {fail_ratio:.2%} (batas {MAX_FAIL:.2%}), p95 {p95:.0f} ms (batas {P95_MS:.0f} ms)")
    environment.process_exit_code = 0 if ok else 1
