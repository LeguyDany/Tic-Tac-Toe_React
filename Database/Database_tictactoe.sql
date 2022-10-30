--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

-- Started on 2022-10-30 19:41:41 CET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 24604)
-- Name: game; Type: TABLE; Schema: public; Owner: danyleguy
--

CREATE TABLE public.game (
    game_id uuid NOT NULL,
    turn character varying(50),
    player1 character varying(50),
    player2 character varying(50),
    winner character varying(50),
    size smallint,
    date timestamp with time zone,
    grid text[]
);


ALTER TABLE public.game OWNER TO danyleguy;

--
-- TOC entry 3440 (class 2606 OID 24608)
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: danyleguy
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (game_id);


-- Completed on 2022-10-30 19:41:41 CET

--
-- PostgreSQL database dump complete
--

