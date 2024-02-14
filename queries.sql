-- Table: public.books

-- DROP TABLE IF EXISTS public.books;

CREATE TABLE IF NOT EXISTS public.books
(
    isbn character varying(15) COLLATE pg_catalog."default",
    title character varying(100) COLLATE pg_catalog."default",
    summary text COLLATE pg_catalog."default",
    notes text COLLATE pg_catalog."default",
    website text COLLATE pg_catalog."default",
    rating integer,
    "time" timestamp without time zone DEFAULT now(),
    author character varying(100) COLLATE pg_catalog."default",
    id integer NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    CONSTRAINT books_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.books
    OWNER to postgres;