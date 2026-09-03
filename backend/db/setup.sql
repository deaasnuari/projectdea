-- Jalankan SEKALI sebagai superuser (postgres) untuk membuat role & database.
--   psql -U postgres -f db/setup.sql
-- atau tempel di pgAdmin > Query Tool (saat terhubung sebagai postgres).

create role lazispln with login password 'lazispln';
create database lazispln owner lazispln;
