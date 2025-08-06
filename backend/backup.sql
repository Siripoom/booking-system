--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELED'
);


ALTER TYPE public."BookingStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'HOST',
    'STAFF',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Activity" (
    id integer NOT NULL,
    "placeId" integer NOT NULL,
    name text NOT NULL,
    "maxPeople" integer NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "time" text[]
);


ALTER TABLE public."Activity" OWNER TO postgres;

--
-- Name: Activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Activity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Activity_id_seq" OWNER TO postgres;

--
-- Name: Activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Activity_id_seq" OWNED BY public."Activity".id;


--
-- Name: Booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Booking" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "roomId" integer NOT NULL,
    "bookingDate" timestamp(3) without time zone NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paymentSlip" text NOT NULL,
    "bookingTime" text NOT NULL,
    "numberOfPeople" integer NOT NULL,
    "totalPrice" integer NOT NULL
);


ALTER TABLE public."Booking" OWNER TO postgres;

--
-- Name: Booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Booking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Booking_id_seq" OWNER TO postgres;

--
-- Name: Booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Booking_id_seq" OWNED BY public."Booking".id;


--
-- Name: Place; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Place" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Place" OWNER TO postgres;

--
-- Name: Place_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Place_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Place_id_seq" OWNER TO postgres;

--
-- Name: Place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Place_id_seq" OWNED BY public."Place".id;


--
-- Name: Room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Room" (
    id integer NOT NULL,
    "activityId" integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Room" OWNER TO postgres;

--
-- Name: Room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Room_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Room_id_seq" OWNER TO postgres;

--
-- Name: Room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Room_id_seq" OWNED BY public."Room".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "fullName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "citizenId" text NOT NULL,
    "phoneNumber" text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity" ALTER COLUMN id SET DEFAULT nextval('public."Activity_id_seq"'::regclass);


--
-- Name: Booking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking" ALTER COLUMN id SET DEFAULT nextval('public."Booking_id_seq"'::regclass);


--
-- Name: Place id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place" ALTER COLUMN id SET DEFAULT nextval('public."Place_id_seq"'::regclass);


--
-- Name: Room id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room" ALTER COLUMN id SET DEFAULT nextval('public."Room_id_seq"'::regclass);


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activity" (id, "placeId", name, "maxPeople", price, "createdAt", "time") FROM stdin;
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Booking" (id, "userId", "roomId", "bookingDate", status, "createdAt", "paymentSlip", "bookingTime", "numberOfPeople", "totalPrice") FROM stdin;
\.


--
-- Data for Name: Place; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Place" (id, name, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Room" (id, "activityId", name, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "fullName", email, password, role, "createdAt", "updatedAt", "citizenId", "phoneNumber") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e078f0fb-fe69-4118-92ea-e34ed5ab67b4	9d72f37e46f7d57afc6e6c9628d9488ca4be23bd69d1d09c6e1391a3cdad1c56	2025-08-02 09:47:58.922346+00	20250217162736_userandrole	\N	\N	2025-08-02 09:47:58.90201+00	1
0571ec64-f0a2-45a1-ae27-a25fedb5c54e	8baaedc0bbd45c09d983486d56abc8f6e05c6440f112e9f0603216035ed54c6b	2025-08-02 09:47:58.938416+00	20250222135344_init	\N	\N	2025-08-02 09:47:58.925574+00	1
1c3cd32a-9cfb-400a-bdca-6e9b3c991c77	027d569b736059891bb2aca5e2260d960f213e75cee2076072af0321ea4225e1	2025-08-02 09:47:58.964942+00	20250222140536_init	\N	\N	2025-08-02 09:47:58.941494+00	1
07939fbf-5bcd-4135-993a-a92c251b7196	b290547b06860f83da73f034b774b4a6a9bbf22d5dfe7394850e52879df1706a	2025-08-02 09:47:58.979688+00	20250224143441_init	\N	\N	2025-08-02 09:47:58.96838+00	1
024c1b4a-31f7-48fe-8432-930ce0d52cc9	be21e9dd26c139d22501b65aedc868b236d81b8642b1695d2e56cc2faa8d22da	2025-08-02 09:47:58.992132+00	20250311074746_init	\N	\N	2025-08-02 09:47:58.982768+00	1
8b27e76e-107a-4a24-953a-9728e7d982e7	e412591295b745ca5730e73aae644b1b55488b97afd95d004dd3191fdd56604d	2025-08-02 09:47:59.005825+00	20250316152524_init	\N	\N	2025-08-02 09:47:58.995933+00	1
37fd0483-4149-4dc6-8384-08dc666dd730	cd38212cc52eea24434e0ab37a3de4fb56c1958f2237b6a023386790f674f3c8	2025-08-02 09:47:59.023356+00	20250317165450_init	\N	\N	2025-08-02 09:47:59.008896+00	1
3002bf88-6b4c-4d23-b1be-1ef59a325cfd	bbf626bc10dcbe4f25901438e905ee7f77d14957524edd5980114bc24d663597	2025-08-02 09:47:59.038579+00	20250321031004_init	\N	\N	2025-08-02 09:47:59.02757+00	1
b80a855e-395d-41fc-87f3-bf0e3f978928	04eb003f688a46c5864358f80a690cd8334f10b7110b643b79baea527f4def89	2025-08-02 09:47:59.056258+00	20250401155540_init	\N	\N	2025-08-02 09:47:59.042113+00	1
81ca2c61-34e9-4d01-8edd-84841e71de5d	98fe402a83a4d566e54484f80847d7ffa3b12eab4fa7e72bd51470a979a721a3	2025-08-02 09:47:59.070347+00	20250401163341_init	\N	\N	2025-08-02 09:47:59.059388+00	1
8012d4f0-4e55-4eec-8ddb-11a6a373802f	825a961952c58f0cc9ac71e0da82553c973bbdee18e6a846fc6a42d4e664682e	2025-08-02 09:47:59.086718+00	20250502060552_init	\N	\N	2025-08-02 09:47:59.073481+00	1
41715ad1-2610-43fc-8506-ba85af5259f9	7c7575f9e108abc0e4e21e7176921d03c2fc68f6e497815679ffd63cbdcf2ba3	2025-08-02 09:47:59.100715+00	20250502060641_init	\N	\N	2025-08-02 09:47:59.090169+00	1
2c6b0592-62f2-4614-b4cd-558f0e06ba06	c728ba6d7943d66d11b1fc7c92186ca8581318011647140289827898e95de256	2025-08-02 09:47:59.115081+00	20250502060748_init	\N	\N	2025-08-02 09:47:59.10371+00	1
\.


--
-- Name: Activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Activity_id_seq"', 1, false);


--
-- Name: Booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Booking_id_seq"', 1, false);


--
-- Name: Place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Place_id_seq"', 1, false);


--
-- Name: Room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Room_id_seq"', 1, false);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: Place Place_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_pkey" PRIMARY KEY (id);


--
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_id_key" ON public."User" USING btree (id);


--
-- Name: Activity Activity_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Booking Booking_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."Room"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Room Room_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."Activity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

