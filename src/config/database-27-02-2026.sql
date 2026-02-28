/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 11.8.3-MariaDB-log : Database - u957057232_meufood
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`u957057232_meufood` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `u957057232_meufood`;

/*Table structure for table `SequelizeMeta` */

DROP TABLE IF EXISTS `SequelizeMeta`;

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Data for the table `SequelizeMeta` */

insert  into `SequelizeMeta`(`name`) values 
('20250808165000-create-football-teams-table.js'),
('20250808170000-update-users-table.js.js'),
('20251025225020-create-token-blacklist.js'),
('20251027222629-add-profile-fields-to-users.js'),
('20251101004500-update-stores-add-owner-id.js'),
('20251101013000-add-fields-to-stores.js'),
('20251101030000-create-store-schedules.js'),
('20251101033000-add-id-code-to-stores.js'),
('20251102000000-add-description-to-stores.js'),
('20251103000000-standardize-store-id-codes.js'),
('20251105093000-add-google-uid-to-users.js'),
('20251106094000-create-events-and-qa-tables.js'),
('20251106095200-add-id-code-to-events.js'),
('20251109093000-create-event-guests.js'),
('20251111120000-add-card-background-type-to-events.js'),
('20251111121500-alter-event-responses-add-user-id-and-expand-guest-code.js'),
('20251112090000-add-is-public-to-event-questions.js'),
('20251112093000-add-choice-config-to-event-questions.js'),
('20251114091500-add-auto-checkin-to-event-questions.js'),
('20251114094500-add-auto-checkin-to-events.js'),
('20251114095500-alter-event-guests-check-in-method-add-auto-checkin.js'),
('20251114111000-normalize-event-guests-emails-to-lowercase.js'),
('20251114112300-normalize-users-emails-to-lowercase.js'),
('20251114112400-normalize-events-resp-email-to-lowercase.js'),
('20251114112500-normalize-stores-emails-to-lowercase.js'),
('20251114113000-add-auto-checkin-config-to-events.js'),
('20251120120000-create-event-jam-tables.js'),
('20251201110000-add-ready-to-event-jam-songs.js'),
('20251206090100-create-contasap-vendors.js'),
('20251206090200-create-contasap-payables.js'),
('20251206090300-create-contasap-payments.js'),
('20251206093500-drop-contasap-tables.js'),
('20251206094000-create-fin-vendors.js'),
('20251206094100-create-fin-customers.js'),
('20251206094200-create-fin-accounts-payable.js'),
('20251206094300-create-fin-accounts-receivable.js'),
('20251206094400-create-fin-payments.js'),
('20251212000000-add-selfie-url-to-event-guests.js'),
('20260115090000-create-financial-transactions.js'),
('20260115100000-add-store-and-approval-to-transactions.js'),
('20260117090000-add-soft-delete-and-updated-by-to-transactions.js'),
('20260118060000-change-attachment-url-to-text.js'),
('20260119090000-create-bank-accounts.js'),
('20260120100000-rename-financial-tables.js'),
('20260120120000-create-fin-parties.js'),
('20260120130000-update-party-id-column.js'),
('20260120140000-create-fin-categories-cost-centers-tags.js'),
('20260120141000-update-fin-transactions-add-relations.js'),
('20260121000000-create-fin-recurrences.js'),
('20260123090000-add-allowed-payment-methods-to-bank-accounts.js'),
('20260124000400-create-sys-modules-and-pivot.js'),
('20260124215223-add-id-code-to-sys-modules.js'),
('20260207201209-create-event-jam-music-suggestions.js'),
('20260208100000-add-cover-image-to-suggestions.js'),
('20260208103000-add-cover-image-to-event-jam-songs.js'),
('20260208110000-create-event-jam-music-catalog.js'),
('20260208113000-add-catalog-id-to-event-jam-songs.js'),
('20260208114500-add-catalog-id-to-event-jam-music-suggestions.js'),
('20260210190000-add-id-code-to-event-jams.js'),
('20260211033758-add-id-code-to-jam-songs-and-candidates.js'),
('20260211040000-add-id-code-to-event-guests.js');

/*Table structure for table `event_answers` */

DROP TABLE IF EXISTS `event_answers`;

CREATE TABLE `event_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `response_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_text` text DEFAULT NULL,
  `answer_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answer_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_response_question` (`response_id`,`question_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `event_answers_ibfk_1` FOREIGN KEY (`response_id`) REFERENCES `event_responses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `event_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_answers` */

insert  into `event_answers`(`id`,`response_id`,`question_id`,`answer_text`,`answer_json`,`created_at`) values 
(92,41,47,'Mulher de fases\nProibida pra mim\nExagerado',NULL,'2026-01-10 00:14:39'),
(93,41,48,'Guitar and Vocal',NULL,'2026-01-10 00:14:59'),
(94,41,49,'Eckmarquez',NULL,'2026-01-10 00:15:26'),
(95,41,50,'Emarquez.eng@gmail.com',NULL,'2026-01-10 00:15:49'),
(96,42,47,'Patati Patatá',NULL,'2026-01-10 00:41:15'),
(97,42,48,'Guitar',NULL,'2026-01-10 00:41:24'),
(98,42,49,'@aaad',NULL,'2026-01-10 00:41:33'),
(99,42,50,'Hdhf@jdjdjf.com',NULL,'2026-01-10 00:41:56'),
(100,43,47,'Qualquer um que tiver já os tons :) deixo o teclado ligado se alguém quiser eu acompanho',NULL,'2026-01-10 00:51:18'),
(101,43,49,'Adrianomasini',NULL,'2026-01-10 00:51:37'),
(102,44,47,'Batata frita ',NULL,'2026-01-10 01:00:41'),
(104,44,48,'Agstnsn',NULL,'2026-01-10 01:01:21'),
(105,44,50,'Gahs',NULL,'2026-01-10 01:01:35'),
(106,45,47,'All',NULL,'2026-01-10 02:14:11'),
(107,45,48,'Drums',NULL,'2026-01-10 02:14:39'),
(108,45,49,'Drums / Percussion ',NULL,'2026-01-10 02:15:06'),
(110,45,50,'andre.gafa@outlook.com',NULL,'2026-01-10 02:15:56'),
(111,48,47,'.',NULL,'2026-01-10 02:28:05'),
(112,48,49,'Canto',NULL,'2026-01-10 02:28:15'),
(113,48,48,'Canto',NULL,'2026-01-10 02:45:14'),
(115,49,47,'E.C.T.',NULL,'2026-01-10 02:47:25'),
(116,49,48,'Bateria ',NULL,'2026-01-10 02:47:36'),
(117,49,49,'Raquel Prazeres de Castro mas minha conta está bloqueada no momento ',NULL,'2026-01-10 02:48:14'),
(118,49,50,'raquelprazeres@gmail.com',NULL,'2026-01-10 02:48:30'),
(119,50,47,'Deixa eu te amar',NULL,'2026-01-10 04:13:38'),
(120,50,48,'Acoustic Guitar ',NULL,'2026-01-10 04:14:23'),
(121,50,49,'arielygouveia',NULL,'2026-01-10 04:14:36'),
(122,50,50,'arielygouveia@hotmail.com',NULL,'2026-01-10 04:14:55'),
(123,52,47,'Palpite and Beija eu',NULL,'2026-01-10 05:06:23'),
(124,52,49,'Whitegirlflowers',NULL,'2026-01-10 05:06:41'),
(125,44,49,'@bgf',NULL,'2026-01-10 05:22:32'),
(126,53,47,'Sweet Child O’ Mine - Guns N’ Roses\nSmells Like Teen Spirit - Nirvana\nUm Minuto Para o Fim do Mundo - CPM 22\nLuz Dos Olhos - Nando Reis\nIdeologia - Cazuza\nO Tempo Não Para - Cazuza',NULL,'2026-01-10 06:01:21'),
(127,53,48,'Guitarra e voz',NULL,'2026-01-10 06:01:45'),
(128,53,49,'@thyagosocrates',NULL,'2026-01-10 06:01:59'),
(129,53,50,'thyagomorollo@hotmail.com',NULL,'2026-01-10 06:02:29'),
(130,43,48,'Keyboard',NULL,'2026-01-14 09:45:42'),
(131,43,50,'Adriano',NULL,'2026-01-14 09:45:53');

/*Table structure for table `event_guests` */

DROP TABLE IF EXISTS `event_guests`;

CREATE TABLE `event_guests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(36) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `guest_name` varchar(255) NOT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(20) DEFAULT NULL,
  `guest_document_type` enum('rg','cpf','passport') DEFAULT NULL,
  `guest_document_number` varchar(50) DEFAULT NULL,
  `type` enum('normal','vip','premium') NOT NULL DEFAULT 'normal',
  `source` enum('invited','walk_in') NOT NULL DEFAULT 'invited',
  `rsvp_confirmed` tinyint(1) NOT NULL DEFAULT 0,
  `rsvp_at` datetime DEFAULT NULL,
  `invited_at` datetime NOT NULL DEFAULT current_timestamp(),
  `invited_by_user_id` int(11) DEFAULT NULL,
  `check_in_at` datetime DEFAULT NULL,
  `check_in_method` enum('google','staff_manual','invited_qr','auto_checkin') DEFAULT NULL,
  `authorized_by_user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `selfie_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `event_guests_id_code_unique` (`id_code`),
  UNIQUE KEY `uniq_event_user_guest` (`event_id`,`user_id`),
  UNIQUE KEY `uniq_event_email_guest` (`event_id`,`guest_email`),
  UNIQUE KEY `uniq_event_document_guest` (`event_id`,`guest_document_number`),
  KEY `user_id` (`user_id`),
  KEY `invited_by_user_id` (`invited_by_user_id`),
  KEY `authorized_by_user_id` (`authorized_by_user_id`),
  KEY `idx_event_guests_event_id` (`event_id`),
  KEY `idx_event_guests_event_checkin` (`event_id`,`check_in_at`),
  CONSTRAINT `event_guests_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_guests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `event_guests_ibfk_3` FOREIGN KEY (`invited_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `event_guests_ibfk_4` FOREIGN KEY (`authorized_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_guests` */

insert  into `event_guests`(`id`,`id_code`,`event_id`,`user_id`,`guest_name`,`guest_email`,`guest_phone`,`guest_document_type`,`guest_document_number`,`type`,`source`,`rsvp_confirmed`,`rsvp_at`,`invited_at`,`invited_by_user_id`,`check_in_at`,`check_in_method`,`authorized_by_user_id`,`created_at`,`updated_at`,`selfie_url`) values 
(73,'df17528c-b6d4-4bee-9640-f66e6075dcab',33,26,'Suporte GSuiteCloud','suporte@gsuitecloud.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-08 21:03:46',NULL,'2026-01-08 21:03:46','auto_checkin',NULL,'2026-01-08 21:03:46','2026-02-11 03:47:54','http://localhost:4000/api/v1/files/1ZndD2-yy8gPLJWznZz5VoKMpe6Jk-y1c'),
(74,'5226e96d-0b30-4e6a-b0a1-f1213457a773',33,10,'DAVIS PEREIRA DE VASCONCELLOS','davisvasconcellos@gmail.com','21965445992',NULL,NULL,'normal','invited',0,NULL,'2026-01-08 21:13:04',NULL,'2026-01-08 21:13:04','auto_checkin',NULL,'2026-01-08 21:13:04','2026-02-11 03:47:54','https://beerclub-api.onrender.com/api/v1/files/1H_PnNC9KkgiaJg1RSB-kNUdSrmpnKOiH'),
(75,'7660a1e7-0f9d-4026-af04-b798aba5a0cc',33,22,'digital media','dmediapixel@gmail.com','21222222222',NULL,NULL,'normal','invited',0,NULL,'2026-01-08 21:34:29',NULL,'2026-01-08 21:34:29','auto_checkin',NULL,'2026-01-08 21:34:29','2026-02-11 03:47:54','https://beerclub-api.onrender.com/api/v1/files/1SBnuxiwKQWkTocX3fRM3cFMFfTSETMSP'),
(77,'31ab12b6-c957-4371-b436-af509246c61d',36,27,'Erick MARQUEZ','emarquez.eng@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 00:13:01',NULL,'2026-01-10 00:13:01','auto_checkin',NULL,'2026-01-10 00:13:01','2026-02-11 03:47:54','https://beerclub-api.onrender.com/api/v1/files/1AOxujRn389jlbKt6hq70emIWyNF75G5Z'),
(78,'45e57bbb-6a46-4735-b73c-aa7fd7b06add',36,10,'DAVIS PEREIRA DE VASCONCELLOS','davisvasconcellos@gmail.com','21965445992',NULL,NULL,'normal','invited',0,NULL,'2026-01-10 00:40:24',NULL,'2026-01-10 00:40:24','auto_checkin',NULL,'2026-01-10 00:40:24','2026-02-11 03:47:54','https://beerclub-api.onrender.com/api/v1/files/1EItIjjtqM4JatHRNXj5PbaiHjh_h__D2'),
(79,'31ef3a9b-66a5-4b78-85e3-8a5dc6ff7393',36,31,'Adriano Masini','adrianomasini@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 00:50:32',NULL,'2026-01-10 00:50:32','auto_checkin',NULL,'2026-01-10 00:50:32','2026-02-11 03:47:54',NULL),
(80,'c7e87b0a-318e-4949-8f5a-9ef06fe4f9f4',36,32,'Moni Sbrissa','monisesbrissa@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 00:52:31',NULL,'2026-01-10 00:52:31','auto_checkin',NULL,'2026-01-10 00:52:31','2026-02-11 03:47:54',NULL),
(81,'0830682b-4d1e-417c-8b86-dfc7487f7f27',36,22,'digital media','dmediapixel@gmail.com','21222222222',NULL,NULL,'normal','invited',0,NULL,'2026-01-10 01:00:18',NULL,'2026-01-10 01:00:18','auto_checkin',NULL,'2026-01-10 01:00:18','2026-02-11 03:47:54','https://beerclub-api.onrender.com/api/v1/files/1ZVed0xrkmFI0IbDFifHnYAtaTifcvFZB'),
(82,'c7e18301-ade8-4470-b28a-38d8760d98d9',36,33,'Ariely Gouveia','arielygandrade@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 01:48:17',NULL,'2026-01-10 01:48:17','auto_checkin',NULL,'2026-01-10 01:48:17','2026-02-11 03:47:54',NULL),
(83,'ff19e4b1-0e8a-41ab-b9f5-089a33fe06a5',36,34,'Andre Oliveira','andre.gafa@outlook.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 02:13:28',NULL,'2026-01-10 02:13:28','auto_checkin',NULL,'2026-01-10 02:13:28','2026-02-11 03:47:54',NULL),
(84,'34195a57-1d59-4655-af23-48d007c657a6',36,35,'Thami Prandini','prandinithami@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 02:25:35',NULL,'2026-01-10 02:25:35','auto_checkin',NULL,'2026-01-10 02:25:35','2026-02-11 03:47:54',NULL),
(85,'58f1d1c9-c1d8-42b9-b6fb-7efb1b380b73',36,36,'Raquel Prazeres de Castro','raquelprazeres@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 02:45:46',NULL,'2026-01-10 02:45:46','auto_checkin',NULL,'2026-01-10 02:45:46','2026-02-11 03:47:54',NULL),
(86,'d5fefc36-9ef3-482c-b477-50dca20328e4',36,37,'Branca Dias','brancadias@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 05:05:48',NULL,'2026-01-10 05:05:48','auto_checkin',NULL,'2026-01-10 05:05:48','2026-02-11 03:47:54',NULL),
(87,'59c3d07b-c6e4-466d-adc6-3e5ab21ef1d7',36,38,'Thyago Socrates','thiagomorollo@gmail.com',NULL,NULL,NULL,'normal','invited',0,NULL,'2026-01-10 05:29:21',NULL,'2026-01-10 05:29:21','auto_checkin',NULL,'2026-01-10 05:29:21','2026-02-11 03:47:54',NULL);

/*Table structure for table `event_jam_music_catalog` */

DROP TABLE IF EXISTS `event_jam_music_catalog`;

CREATE TABLE `event_jam_music_catalog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `discogs_id` int(11) DEFAULT NULL,
  `spotify_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `album` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `thumb_image` varchar(255) DEFAULT NULL,
  `lyrics` longtext DEFAULT NULL,
  `chords` longtext DEFAULT NULL,
  `bpm` int(11) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `extra_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_data`)),
  `usage_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `discogs_id` (`discogs_id`),
  UNIQUE KEY `spotify_id` (`spotify_id`),
  KEY `event_jam_music_catalog_id_code` (`id_code`),
  KEY `event_jam_music_catalog_discogs_id` (`discogs_id`),
  KEY `event_jam_music_catalog_title` (`title`),
  KEY `event_jam_music_catalog_artist` (`artist`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jam_music_catalog` */

insert  into `event_jam_music_catalog`(`id`,`id_code`,`discogs_id`,`spotify_id`,`title`,`artist`,`album`,`year`,`genre`,`cover_image`,`thumb_image`,`lyrics`,`chords`,`bpm`,`key`,`extra_data`,`usage_count`,`created_at`,`updated_at`) values 
(1,'6e4faea1-80c0-415f-96c9-1191b8cddebd',95611,NULL,'Beatles (Mock Song)','Mock Artist',NULL,'2024','R','https://placehold.co/600x600?text=Cover','https://placehold.co/150x150?text=Thumb',NULL,NULL,NULL,NULL,'{\"id\":95611,\"title\":\"Beatles (Mock Song)\",\"artist\":\"Mock Artist\",\"album\":\"Mock Album\",\"year\":\"2024\",\"genre\":\"Rock\",\"cover_image\":\"https://placehold.co/600x600?text=Cover\",\"thumb\":\"https://placehold.co/150x150?text=Thumb\",\"resource_url\":\"http://mock-api.discogs.com/release/123\"}',0,'2026-02-10 16:26:31','2026-02-10 16:26:31'),
(2,'19cbd8b1-c9d6-4149-9b16-de6a5ae14e02',64243,NULL,'Another Beatles','Mock Band',NULL,'2023','P','https://placehold.co/600x600?text=Cover2','https://placehold.co/150x150?text=Thumb2',NULL,NULL,NULL,NULL,'{\"id\":64243,\"title\":\"Another Beatles\",\"artist\":\"Mock Band\",\"album\":\"Greatest Hits\",\"year\":\"2023\",\"genre\":\"Pop\",\"cover_image\":\"https://placehold.co/600x600?text=Cover2\",\"thumb\":\"https://placehold.co/150x150?text=Thumb2\",\"resource_url\":\"http://mock-api.discogs.com/release/456\"}',0,'2026-02-10 16:26:31','2026-02-10 16:26:31'),
(3,'6b7a30ee-6de8-431a-83bc-e46907520837',7097051,NULL,'Nevermind','Nirvana',NULL,NULL,NULL,'https://i.discogs.com/uCeQtLv9OSNjC5_AjarCojZNepI9vqcnYeqsImnzXyg/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTcwOTcw/NTEtMTU1NjQ0NDE4/MC03NTA1LmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-25 20:55:05','2026-02-25 20:55:05'),
(4,'b4ff2f7d-53c6-4d38-b931-1fd54013f16b',9904522,NULL,'Eagle Fly Free','Helloween',NULL,NULL,NULL,'https://i.discogs.com/Ios1rX23sMnCG0FTezNiYknRVwoasIMRynupI3CUjlI/rs:fit/g:sm/q:90/h:450/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk5MDQ1/MjItMTQ4ODI4NDg4/Ny02NTU2LmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-25 20:55:40','2026-02-25 20:55:40'),
(5,'b77fa4bc-245f-409a-958a-b0b616506f61',9269315,NULL,'Sgt. Pepper\'s Lonely Hearts Club Band','The Beatles',NULL,NULL,NULL,'https://i.discogs.com/oTQaA8Qx54QYKqW1tREPrzDBX7oh5Tpc_gSlSUgCof8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTkyNjkz/MTUtMTQ3NzY5Mjc5/My0yNjMxLmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 08:54:58','2026-02-26 08:54:58'),
(6,'b53cd1aa-94f3-4043-8dfc-4638c794bdeb',9407400,NULL,'MTV Ao Vivo Volume 01','Raimundos',NULL,NULL,NULL,'https://i.discogs.com/HSwkjmAnF0iolbIzyIysc5nsXzixkbpSovgOWM1lIhQ/rs:fit/g:sm/q:90/h:598/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk0MDc0/MDAtMTQ4MDAyMjIy/Ny01MjczLmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 08:56:36','2026-02-26 08:56:36'),
(7,'20c12243-3a1f-479d-b4ea-247e5396bc37',11088399,NULL,'Roots','Sepultura',NULL,NULL,NULL,'https://i.discogs.com/MgeMe0tWEbWjVPyLHt76xCoeYUJJ1AgVrz8c1jbTJA0/rs:fit/g:sm/q:90/h:592/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExMDg4/Mzk5LTE2MTMwMjM2/NDctNTkyMC5qcGVn.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 08:57:49','2026-02-26 08:57:49'),
(8,'a50fd232-9b89-4706-b8d0-cf5c8f05c97c',2080203,NULL,'Visions','Stratovarius',NULL,NULL,NULL,'https://i.discogs.com/p4aYNfs8E-b2VkmuWLs0DWfioYmBQ4tAozY9KBK6Tgc/rs:fit/g:sm/q:90/h:486/w:541/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwODAy/MDMtMTcxNTY4MTQy/MC00NTUzLmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 08:58:33','2026-02-26 08:58:33'),
(9,'168295f2-9a0b-42d9-822f-94f830486f55',9287809,NULL,'The Dark Side Of The Moon','Pink Floyd',NULL,NULL,NULL,'https://i.discogs.com/1fwskTLM6cfxbdNmBDJ8expl6wab0tEgxvuloLIqKh8/rs:fit/g:sm/q:90/h:596/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTkyODc4/MDktMTQ3OTc1MzIz/Ni05NjE3LmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 08:59:47','2026-02-26 08:59:47'),
(10,'2e282d83-bc8a-44cd-9f50-b4d59a2cea80',1317653,NULL,'Pearl Jam','Pearl Jam',NULL,NULL,NULL,'https://i.discogs.com/7f0e3GsdCSMk3VmkgYeFCgTViDCztuoTg-AnaT8AA7s/rs:fit/g:sm/q:90/h:535/w:597/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzMTc2/NTMtMTIwOTE4NDMz/MC5qcGVn.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 09:00:46','2026-02-26 09:00:46'),
(11,'19ef947a-b4c0-4fe0-8246-f4e8e42de5ca',11116451,NULL,'Ten','Pearl Jam',NULL,NULL,NULL,'https://i.discogs.com/QC8HQ8n--58VZuE6Ikz0MRb0E1HtOFfLyG0KTSQkH3Y/rs:fit/g:sm/q:90/h:603/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExMTE2/NDUxLTE1MTE1Mzk0/MTYtMzkyMi5qcGVn.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 09:01:47','2026-02-26 09:01:47'),
(12,'d9da43e1-ab9b-4111-80a5-ad425266bacc',1363683,NULL,'GHV2 (Greatest Hits Volume 2)','Madonna',NULL,NULL,NULL,'https://i.discogs.com/sokqmcJ-Un2lkUo20BE3ejWrfJLAk_RWJmGIEopnckI/rs:fit/g:sm/q:90/h:310/w:310/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzNjM2/ODMtMTM0NTAzMzM0/OS00MzM4LmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 09:02:19','2026-02-26 09:02:19'),
(13,'355175a4-8b43-44ba-8f3b-d414c1b33a2a',6825654,NULL,'Unplugged','R.E.M.',NULL,NULL,NULL,'https://i.discogs.com/0pQc1Fp2spbsSeXZypcEf_H2_Rt1irS2bZ6yQvzviW0/rs:fit/g:sm/q:90/h:480/w:477/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY4MjU2/NTQtMTQyNzQxOTQw/My00MzQzLmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 09:03:04','2026-02-26 09:03:04'),
(14,'919dd6c0-c87c-4822-aece-1713e3b885ab',3242612,NULL,'Foo Fighters','Foo Fighters',NULL,NULL,NULL,'https://i.discogs.com/M_QNya94MpMhPXeKW1_qjHT-vzoz8UubLokyzNCbrvo/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMyNDI2/MTItMTQyODA5NTM3/OS0yNDUzLmpwZWc.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-26 22:44:23','2026-02-26 22:44:23'),
(15,'c8406b2f-3619-4fa6-aad4-9aa447a85e44',10210431,NULL,'Beatles For Sale','The Beatles',NULL,NULL,NULL,'https://i.discogs.com/QdKth0XB-lh88VU1qMTF56xMAh-GvYCAlZLYxeQvW0Y/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEwMjEw/NDMxLTE0OTM0NjAx/NDAtMzA3OS5qcGVn.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-27 05:01:20','2026-02-27 05:01:20'),
(16,'22fbfea0-9414-462e-b57b-671775679c86',11735805,NULL,'Fagner & Zeca Baleiro','Raimundo Fagner & Zeca Baleiro',NULL,NULL,NULL,'https://i.discogs.com/L0sleo-SJkTWiEuR1qfFMaPT02RIOtu_bd2C-F8xCpc/rs:fit/g:sm/q:90/h:388/w:430/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExNzM1/ODA1LTE1MjE0OTI0/MzYtMzIxOS5qcGVn.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-02-27 05:12:49','2026-02-27 05:12:49');

/*Table structure for table `event_jam_music_suggestion_participants` */

DROP TABLE IF EXISTS `event_jam_music_suggestion_participants`;

CREATE TABLE `event_jam_music_suggestion_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `music_suggestion_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `instrument` varchar(255) NOT NULL,
  `is_creator` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `unique_participant_per_jam_suggestion` (`music_suggestion_id`,`user_id`),
  KEY `event_jam_music_suggestion_participants_music_suggestion_id` (`music_suggestion_id`),
  KEY `event_jam_music_suggestion_participants_user_id` (`user_id`),
  CONSTRAINT `event_jam_music_suggestion_participants_ibfk_1` FOREIGN KEY (`music_suggestion_id`) REFERENCES `event_jam_music_suggestions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_jam_music_suggestion_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jam_music_suggestion_participants` */

insert  into `event_jam_music_suggestion_participants`(`id`,`id_code`,`music_suggestion_id`,`user_id`,`instrument`,`is_creator`,`status`,`created_at`,`updated_at`) values 
(5,'6a4dd6dd-41ff-457a-88b4-0868dc1933a0',4,10,'Voz',1,'ACCEPTED','2026-02-08 02:30:19','2026-02-08 02:30:19'),
(6,'1eed7cce-12b6-454b-8d43-aad392f4473d',5,10,'Voz',1,'ACCEPTED','2026-02-08 02:30:58','2026-02-08 02:30:58'),
(7,'33fba215-48e3-4ab6-85f9-d47d55b4bd4a',5,22,'Voz',0,'ACCEPTED','2026-02-08 02:30:58','2026-02-08 03:55:28'),
(8,'3dd9bd3d-f25a-499b-b143-bbe358dec137',6,10,'Voz',1,'ACCEPTED','2026-02-08 02:31:52','2026-02-08 02:31:52'),
(9,'5ae36c42-0fa5-4537-81ec-08251a808716',6,22,'Voz',0,'ACCEPTED','2026-02-08 02:31:52','2026-02-08 03:55:04'),
(10,'7eb3dacf-a818-4e73-a73c-3cf64f287ec3',6,26,'Baixo',0,'PENDING','2026-02-08 02:31:53','2026-02-08 02:31:53'),
(11,'b0bc9667-958b-4be5-8958-72743f32d072',7,10,'Voz',1,'ACCEPTED','2026-02-08 04:28:39','2026-02-08 04:28:39'),
(12,'17ec70cc-d1f2-4afb-9a7b-6219d38a8b5e',7,22,'Voz',0,'PENDING','2026-02-08 04:28:39','2026-02-08 04:28:39'),
(13,'1ab5a19f-c580-43f7-84db-33fb65028a7e',8,22,'Guitarra',1,'ACCEPTED','2026-02-08 04:34:54','2026-02-08 04:34:54'),
(14,'f6d9bd11-6f18-482f-b35f-3f0597f55673',8,26,'Baixo',0,'PENDING','2026-02-08 04:34:54','2026-02-08 04:34:54'),
(54,'b52ab99e-489a-4bef-8aa4-cd4474b6ba0b',30,10,'guitarra',1,'ACCEPTED','2026-02-08 23:13:40','2026-02-08 23:13:40'),
(55,'dbf96876-b29b-4c92-9e94-1a998315f737',30,22,'guitarra',0,'ACCEPTED','2026-02-08 23:13:41','2026-02-24 02:53:23'),
(56,'3736cc38-11bf-4c9b-ad6d-c345f399ec7c',31,10,'voz',1,'ACCEPTED','2026-02-08 23:18:59','2026-02-08 23:18:59'),
(58,'6a08a9fe-5470-48ba-bb9a-bb1b5317af2c',33,10,'guitarra',1,'ACCEPTED','2026-02-08 23:35:07','2026-02-08 23:35:07'),
(59,'b8b3bae2-e8c0-48f0-ba14-e8938f9c02bd',34,10,'voz',1,'ACCEPTED','2026-02-09 05:03:17','2026-02-09 05:03:17'),
(60,'579e89ee-d7a8-4c29-91a3-25fe5fe6a6f6',31,26,'violao',0,'PENDING','2026-02-11 01:06:30','2026-02-11 01:06:30');

/*Table structure for table `event_jam_music_suggestions` */

DROP TABLE IF EXISTS `event_jam_music_suggestions`;

CREATE TABLE `event_jam_music_suggestions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `song_name` varchar(255) NOT NULL,
  `artist_name` varchar(255) NOT NULL,
  `created_by_user_id` int(11) NOT NULL,
  `status` enum('DRAFT','SUBMITTED','APPROVED','REJECTED') NOT NULL DEFAULT 'DRAFT',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `cover_image` varchar(255) DEFAULT NULL,
  `extra_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_data`)),
  `catalog_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `event_id` (`event_id`),
  KEY `event_jam_music_suggestions_created_by_user_id` (`created_by_user_id`),
  KEY `event_jam_music_suggestions_catalog_id_foreign_idx` (`catalog_id`),
  CONSTRAINT `event_jam_music_suggestions_catalog_id_foreign_idx` FOREIGN KEY (`catalog_id`) REFERENCES `event_jam_music_catalog` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `event_jam_music_suggestions_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `event_jam_music_suggestions_ibfk_2` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jam_music_suggestions` */

insert  into `event_jam_music_suggestions`(`id`,`id_code`,`event_id`,`song_name`,`artist_name`,`created_by_user_id`,`status`,`created_at`,`updated_at`,`cover_image`,`extra_data`,`catalog_id`) values 
(4,'6fc9d5db-00ab-41b8-8130-3acb5fd39577',NULL,'song1','sada',10,'DRAFT','2026-02-08 02:30:18','2026-02-08 02:30:18',NULL,NULL,NULL),
(5,'f3241f0b-9d6b-4079-89f8-f2b9e69aba48',NULL,'song2','sad',10,'DRAFT','2026-02-08 02:30:58','2026-02-08 02:30:58',NULL,NULL,NULL),
(6,'f0b6df7d-33b9-4ba2-b25a-7b04c3567bc2',NULL,'song 3','asdasd',10,'DRAFT','2026-02-08 02:31:52','2026-02-08 02:31:52',NULL,NULL,NULL),
(7,'4f4836cf-67e0-490d-bb22-1a323176351f',NULL,'song5','jh',10,'DRAFT','2026-02-08 04:28:39','2026-02-08 04:28:39',NULL,NULL,NULL),
(8,'91d912b7-8348-40a4-92c7-b82bca0efb2d',NULL,'song5','jjkhk',22,'DRAFT','2026-02-08 04:34:54','2026-02-08 04:34:54',NULL,NULL,NULL),
(30,'0c022048-2419-43ab-b8f5-a856c098dc77',33,'Smells Like Teen Spirit','Nirvana',10,'APPROVED','2026-02-08 23:13:40','2026-02-10 22:35:50','https://i.discogs.com/a8go4FwLfeSjzxOsrwY8EFliXSzeGxH8XwW34Ka7ACs/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ0MDk5/OC0xNjI1MDQ1OTA4/LTk1NDEuanBlZw.jpeg',NULL,NULL),
(31,'031f2812-7da2-47d7-a0bf-1a64abe34639',33,'Enter Sandman','Metallica',10,'APPROVED','2026-02-08 23:18:59','2026-02-11 01:06:30','https://i.discogs.com/d_vlLxxffvQlIvyGRnVLaqT3-gfXkEtbTUcQ6yKjEJQ/rs:fit/g:sm/q:90/h:602/w:599/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQzODk0/Ni0xMjM0Mjk2NzQy/LmpwZWc.jpeg',NULL,NULL),
(33,'476f3f7e-26cf-4d40-b9c9-c465240a9c25',33,'Hey Jude','The Beatles',10,'DRAFT','2026-02-08 23:35:07','2026-02-08 23:35:07','https://i.discogs.com/YXtw8LVGVdkRBUPsyEfr6Gcy5my3rbVIzGE3F1ml_F0/rs:fit/g:sm/q:90/h:589/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc0NTAw/NC0xMzcwODg1NzEz/LTI2OTIuanBlZw.jpeg',NULL,NULL),
(34,'6568b7cd-adb1-4b5c-9ec8-7bbc9253f6ad',33,'The Final Countdown','Europe (2)',10,'APPROVED','2026-02-09 05:03:17','2026-02-09 05:14:24','https://i.discogs.com/NWOLPm6oG3mru-RXJoKLCNXMijPs7pOLNERcDrh03C0/rs:fit/g:sm/q:90/h:597/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM4NDEz/MS0xNjg2MDIxODQ5/LTIxNTAuanBlZw.jpeg',NULL,NULL);

/*Table structure for table `event_jam_song_candidates` */

DROP TABLE IF EXISTS `event_jam_song_candidates`;

CREATE TABLE `event_jam_song_candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(36) NOT NULL,
  `jam_song_id` int(11) NOT NULL,
  `instrument` enum('guitar','bass','drums','keys','vocals','horns','percussion','strings','other') NOT NULL,
  `event_guest_id` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `applied_at` datetime NOT NULL DEFAULT current_timestamp(),
  `approved_at` datetime DEFAULT NULL,
  `approved_by_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jam_song_instrument_candidate` (`jam_song_id`,`instrument`,`event_guest_id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `event_guest_id` (`event_guest_id`),
  KEY `approved_by_user_id` (`approved_by_user_id`),
  CONSTRAINT `event_jam_song_candidates_ibfk_1` FOREIGN KEY (`jam_song_id`) REFERENCES `event_jam_songs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_jam_song_candidates_ibfk_2` FOREIGN KEY (`event_guest_id`) REFERENCES `event_guests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_jam_song_candidates_ibfk_3` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jam_song_candidates` */

insert  into `event_jam_song_candidates`(`id`,`id_code`,`jam_song_id`,`instrument`,`event_guest_id`,`status`,`applied_at`,`approved_at`,`approved_by_user_id`) values 
(207,'c8809999-0211-4120-9d5f-5d1c60699e07',158,'vocals',77,'pending','2026-01-10 01:52:45',NULL,NULL),
(208,'6faea30f-16da-4ef4-9b00-c753622d76bd',167,'guitar',77,'approved','2026-01-10 01:54:00','2026-01-14 09:52:47',27),
(209,'512ea4a3-88c1-4b2c-87b1-3b7de9b1d178',168,'guitar',77,'rejected','2026-01-10 01:54:07',NULL,NULL),
(210,'34478707-8e00-460e-95ed-3df99dcac743',169,'guitar',77,'approved','2026-01-10 01:54:10','2026-01-14 09:52:25',27),
(211,'5f0f020f-8c6a-4439-ac5d-dfb0b3a8effc',159,'drums',83,'pending','2026-01-10 02:16:41',NULL,NULL),
(212,'6aa42345-b153-48a5-baf7-e4b4f305d3af',168,'drums',83,'rejected','2026-01-10 02:17:04',NULL,NULL),
(213,'8a803890-80dd-493d-8e34-ce3f158ff74c',161,'percussion',85,'pending','2026-01-10 02:49:18',NULL,NULL),
(214,'487a7113-a82b-47fa-a117-849b5ea16162',170,'percussion',85,'pending','2026-01-10 02:49:56',NULL,NULL),
(215,'6eb17f6c-f705-4f02-9f7b-2963417814dd',169,'vocals',86,'approved','2026-01-10 05:07:20','2026-01-14 09:52:24',27),
(216,'3f756fad-2157-4ad6-9dfa-2f6e15756a48',170,'vocals',86,'pending','2026-01-10 05:07:32',NULL,NULL),
(217,'540e5623-2656-4d3d-b06e-1f1847faaaf8',158,'guitar',87,'pending','2026-01-10 06:03:05',NULL,NULL),
(218,'e06ac39c-4ada-41b1-9bdd-632faacd4d0c',160,'guitar',78,'approved','2026-01-11 03:13:14','2026-01-14 09:50:07',27),
(219,'1c6106c5-b943-4885-98f0-3c92f66f15af',160,'keys',79,'approved','2026-01-14 09:48:40','2026-01-14 09:50:10',27),
(233,'6b81b1a1-eaf9-4dd4-a1bf-1b7af229b502',203,'vocals',75,'approved','2026-02-25 20:22:55','2026-02-25 20:22:55',10),
(234,'90db1d53-7046-4961-bd74-de47e110fb2c',203,'guitar',73,'approved','2026-02-25 20:22:55','2026-02-25 20:22:55',10),
(235,'fe736a4f-f795-4a43-8287-423070ab28ae',209,'guitar',75,'approved','2026-02-25 20:55:40','2026-02-25 20:55:40',10),
(236,'59127136-808e-4a61-bef7-c36e2b09a8a0',210,'vocals',75,'approved','2026-02-26 08:54:58','2026-02-26 08:54:58',10),
(237,'7edf9333-7912-42a0-8809-aa1b325023f9',211,'guitar',73,'approved','2026-02-26 08:56:36','2026-02-26 08:56:36',10),
(238,'17c07855-444c-46eb-921f-115122286d4a',212,'vocals',73,'approved','2026-02-26 08:57:49','2026-02-26 08:57:49',10),
(239,'5d95507f-4544-4590-9e72-9fc4b34b58ae',213,'vocals',73,'approved','2026-02-26 08:58:33','2026-02-26 08:58:33',10),
(240,'f7c87aa1-b6b4-47c1-91cc-4b3586b8b1ea',215,'guitar',73,'approved','2026-02-26 09:00:46','2026-02-26 09:00:46',10),
(241,'ac8d2922-769b-4f94-bba8-5fca20264508',216,'guitar',75,'approved','2026-02-26 09:01:47','2026-02-26 09:01:47',10),
(242,'1c095ca9-2e90-42a3-802b-cb67cb393dd3',217,'guitar',73,'approved','2026-02-26 09:02:19','2026-02-26 09:02:19',10),
(243,'6fab80d2-f28d-409f-be65-b5f0d9d4b387',218,'guitar',73,'approved','2026-02-26 09:03:04','2026-02-26 09:03:04',10);

/*Table structure for table `event_jam_song_instrument_slots` */

DROP TABLE IF EXISTS `event_jam_song_instrument_slots`;

CREATE TABLE `event_jam_song_instrument_slots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jam_song_id` int(11) NOT NULL,
  `instrument` enum('guitar','bass','drums','keys','vocals','horns','percussion','strings','other') NOT NULL,
  `slots` int(11) NOT NULL DEFAULT 1,
  `required` tinyint(1) NOT NULL DEFAULT 1,
  `fallback_allowed` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `jam_song_id` (`jam_song_id`),
  CONSTRAINT `event_jam_song_instrument_slots_ibfk_1` FOREIGN KEY (`jam_song_id`) REFERENCES `event_jam_songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=611 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jam_song_instrument_slots` */

insert  into `event_jam_song_instrument_slots`(`id`,`jam_song_id`,`instrument`,`slots`,`required`,`fallback_allowed`,`created_at`) values 
(392,158,'vocals',1,1,1,'2026-01-10 00:19:49'),
(393,158,'guitar',1,1,1,'2026-01-10 00:19:49'),
(394,158,'keys',1,1,1,'2026-01-10 00:19:49'),
(395,158,'horns',1,1,1,'2026-01-10 00:19:50'),
(396,159,'vocals',1,1,1,'2026-01-10 00:22:20'),
(397,159,'guitar',1,1,1,'2026-01-10 00:22:21'),
(398,159,'bass',1,1,1,'2026-01-10 00:22:21'),
(399,159,'keys',1,1,1,'2026-01-10 00:22:21'),
(400,159,'drums',1,1,1,'2026-01-10 00:22:21'),
(401,159,'horns',1,1,1,'2026-01-10 00:22:21'),
(402,159,'strings',1,1,1,'2026-01-10 00:22:21'),
(403,159,'other',1,1,1,'2026-01-10 00:22:22'),
(404,160,'vocals',1,1,1,'2026-01-10 00:24:48'),
(405,160,'guitar',1,1,1,'2026-01-10 00:24:49'),
(406,160,'bass',1,1,1,'2026-01-10 00:24:49'),
(407,160,'keys',1,1,1,'2026-01-10 00:24:49'),
(408,160,'drums',1,1,1,'2026-01-10 00:24:49'),
(409,160,'horns',1,1,1,'2026-01-10 00:24:50'),
(410,160,'percussion',1,1,1,'2026-01-10 00:24:50'),
(411,160,'strings',1,1,1,'2026-01-10 00:24:50'),
(412,160,'other',1,1,1,'2026-01-10 00:24:50'),
(413,161,'vocals',1,1,1,'2026-01-10 00:26:39'),
(414,161,'guitar',1,1,1,'2026-01-10 00:26:40'),
(415,161,'bass',1,1,1,'2026-01-10 00:26:40'),
(416,161,'keys',1,1,1,'2026-01-10 00:26:40'),
(417,161,'drums',1,1,1,'2026-01-10 00:26:40'),
(418,161,'horns',1,1,1,'2026-01-10 00:26:41'),
(419,161,'percussion',1,1,1,'2026-01-10 00:26:41'),
(420,161,'strings',1,1,1,'2026-01-10 00:26:41'),
(421,161,'other',1,1,1,'2026-01-10 00:26:41'),
(422,162,'vocals',1,1,1,'2026-01-10 00:26:42'),
(423,162,'guitar',1,1,1,'2026-01-10 00:26:43'),
(424,162,'bass',1,1,1,'2026-01-10 00:26:43'),
(425,162,'keys',1,1,1,'2026-01-10 00:26:43'),
(426,162,'drums',1,1,1,'2026-01-10 00:26:43'),
(427,162,'horns',1,1,1,'2026-01-10 00:26:43'),
(428,162,'percussion',1,1,1,'2026-01-10 00:26:44'),
(429,162,'strings',1,1,1,'2026-01-10 00:26:44'),
(430,162,'other',1,1,1,'2026-01-10 00:26:44'),
(431,163,'vocals',1,1,1,'2026-01-10 00:27:55'),
(432,163,'guitar',1,1,1,'2026-01-10 00:27:55'),
(433,163,'bass',1,1,1,'2026-01-10 00:27:56'),
(434,163,'keys',1,1,1,'2026-01-10 00:27:56'),
(435,163,'drums',1,1,1,'2026-01-10 00:27:56'),
(436,163,'horns',1,1,1,'2026-01-10 00:27:56'),
(437,163,'percussion',1,1,1,'2026-01-10 00:27:56'),
(438,163,'strings',1,1,1,'2026-01-10 00:27:56'),
(439,163,'other',1,1,1,'2026-01-10 00:27:57'),
(440,164,'vocals',1,1,1,'2026-01-10 00:28:46'),
(441,164,'guitar',1,1,1,'2026-01-10 00:28:46'),
(442,164,'bass',1,1,1,'2026-01-10 00:28:47'),
(443,164,'keys',1,1,1,'2026-01-10 00:28:47'),
(444,164,'drums',1,1,1,'2026-01-10 00:28:47'),
(445,164,'horns',1,1,1,'2026-01-10 00:28:47'),
(446,164,'percussion',1,1,1,'2026-01-10 00:28:47'),
(447,164,'strings',1,1,1,'2026-01-10 00:28:48'),
(448,164,'other',1,1,1,'2026-01-10 00:28:48'),
(449,165,'vocals',1,1,1,'2026-01-10 00:29:27'),
(450,165,'guitar',1,1,1,'2026-01-10 00:29:27'),
(451,165,'bass',1,1,1,'2026-01-10 00:29:27'),
(452,165,'keys',1,1,1,'2026-01-10 00:29:27'),
(453,165,'drums',1,1,1,'2026-01-10 00:29:28'),
(454,165,'horns',1,1,1,'2026-01-10 00:29:28'),
(455,165,'percussion',1,1,1,'2026-01-10 00:29:28'),
(456,165,'strings',1,1,1,'2026-01-10 00:29:28'),
(457,165,'other',1,1,1,'2026-01-10 00:29:28'),
(458,166,'vocals',1,1,1,'2026-01-10 00:30:18'),
(459,166,'guitar',1,1,1,'2026-01-10 00:30:19'),
(460,166,'bass',1,1,1,'2026-01-10 00:30:19'),
(461,166,'keys',1,1,1,'2026-01-10 00:30:19'),
(462,166,'drums',1,1,1,'2026-01-10 00:30:19'),
(463,166,'horns',1,1,1,'2026-01-10 00:30:20'),
(464,166,'percussion',1,1,1,'2026-01-10 00:30:20'),
(465,166,'strings',1,1,1,'2026-01-10 00:30:20'),
(466,166,'other',1,1,1,'2026-01-10 00:30:20'),
(467,167,'vocals',1,1,1,'2026-01-10 00:30:55'),
(468,167,'guitar',1,1,1,'2026-01-10 00:30:56'),
(469,167,'bass',1,1,1,'2026-01-10 00:30:56'),
(470,167,'keys',1,1,1,'2026-01-10 00:30:56'),
(471,167,'drums',1,1,1,'2026-01-10 00:30:56'),
(472,167,'horns',1,1,1,'2026-01-10 00:30:56'),
(473,167,'percussion',1,1,1,'2026-01-10 00:30:57'),
(474,167,'strings',1,1,1,'2026-01-10 00:30:57'),
(475,167,'other',1,1,1,'2026-01-10 00:30:57'),
(476,168,'vocals',1,1,1,'2026-01-10 00:31:28'),
(477,168,'guitar',1,1,1,'2026-01-10 00:31:28'),
(478,168,'bass',1,1,1,'2026-01-10 00:31:28'),
(479,168,'keys',1,1,1,'2026-01-10 00:31:29'),
(480,168,'drums',1,1,1,'2026-01-10 00:31:29'),
(481,168,'horns',1,1,1,'2026-01-10 00:31:29'),
(482,168,'percussion',1,1,1,'2026-01-10 00:31:29'),
(483,168,'strings',1,1,1,'2026-01-10 00:31:29'),
(484,168,'other',1,1,1,'2026-01-10 00:31:30'),
(485,169,'vocals',1,1,1,'2026-01-10 00:32:50'),
(486,169,'guitar',1,1,1,'2026-01-10 00:32:51'),
(487,169,'bass',1,1,1,'2026-01-10 00:32:51'),
(488,169,'keys',1,1,1,'2026-01-10 00:32:51'),
(489,169,'drums',1,1,1,'2026-01-10 00:32:51'),
(490,169,'horns',1,1,1,'2026-01-10 00:32:51'),
(491,169,'percussion',1,1,1,'2026-01-10 00:32:52'),
(492,169,'strings',1,1,1,'2026-01-10 00:32:52'),
(493,169,'other',1,1,1,'2026-01-10 00:32:52'),
(494,170,'vocals',1,1,1,'2026-01-10 00:33:22'),
(495,170,'guitar',1,1,1,'2026-01-10 00:33:22'),
(496,170,'bass',1,1,1,'2026-01-10 00:33:22'),
(497,170,'keys',1,1,1,'2026-01-10 00:33:23'),
(498,170,'drums',1,1,1,'2026-01-10 00:33:23'),
(499,170,'horns',1,1,1,'2026-01-10 00:33:23'),
(500,170,'percussion',1,1,1,'2026-01-10 00:33:23'),
(501,170,'strings',1,1,1,'2026-01-10 00:33:23'),
(502,170,'other',1,1,1,'2026-01-10 00:33:24'),
(583,203,'vocals',2,0,1,'2026-02-25 20:22:55'),
(584,203,'guitar',1,0,1,'2026-02-25 20:22:55'),
(585,208,'vocals',2,0,1,'2026-02-25 20:55:05'),
(586,209,'vocals',2,0,1,'2026-02-25 20:55:40'),
(587,209,'guitar',1,0,1,'2026-02-25 20:55:40'),
(588,210,'vocals',2,0,1,'2026-02-26 08:54:58'),
(589,211,'guitar',2,0,1,'2026-02-26 08:56:36'),
(590,212,'vocals',2,0,1,'2026-02-26 08:57:49'),
(591,213,'vocals',2,0,1,'2026-02-26 08:58:33'),
(592,214,'vocals',1,0,1,'2026-02-26 08:59:47'),
(593,215,'vocals',1,0,1,'2026-02-26 09:00:46'),
(594,215,'guitar',1,0,1,'2026-02-26 09:00:46'),
(595,216,'vocals',1,0,1,'2026-02-26 09:01:47'),
(596,216,'guitar',1,0,1,'2026-02-26 09:01:47'),
(597,217,'vocals',1,0,1,'2026-02-26 09:02:19'),
(598,217,'guitar',1,0,1,'2026-02-26 09:02:19'),
(599,218,'vocals',2,0,1,'2026-02-26 09:03:04'),
(600,218,'guitar',1,0,1,'2026-02-26 09:03:04'),
(601,219,'guitar',1,1,1,'2026-02-26 09:07:58'),
(602,219,'bass',1,1,1,'2026-02-26 09:07:58'),
(603,219,'vocals',1,1,1,'2026-02-26 09:07:58'),
(604,220,'vocals',1,0,1,'2026-02-26 22:44:23'),
(608,222,'vocals',2,0,1,'2026-02-27 05:01:20'),
(609,222,'guitar',1,0,1,'2026-02-27 05:01:20'),
(610,223,'vocals',1,0,1,'2026-02-27 05:12:49');

/*Table structure for table `event_jam_song_ratings` */

DROP TABLE IF EXISTS `event_jam_song_ratings`;

CREATE TABLE `event_jam_song_ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jam_song_id` int(11) NOT NULL,
  `event_guest_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `stars` int(11) NOT NULL,
  `rated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jam_song_rating_by_guest` (`jam_song_id`,`event_guest_id`),
  UNIQUE KEY `uniq_jam_song_rating_by_user` (`jam_song_id`,`user_id`),
  KEY `event_guest_id` (`event_guest_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `event_jam_song_ratings_ibfk_1` FOREIGN KEY (`jam_song_id`) REFERENCES `event_jam_songs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_jam_song_ratings_ibfk_2` FOREIGN KEY (`event_guest_id`) REFERENCES `event_guests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `event_jam_song_ratings_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jam_song_ratings` */

/*Table structure for table `event_jam_songs` */

DROP TABLE IF EXISTS `event_jam_songs`;

CREATE TABLE `event_jam_songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(36) NOT NULL,
  `jam_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) DEFAULT NULL,
  `key` varchar(10) DEFAULT NULL,
  `tempo_bpm` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `release_batch` int(11) DEFAULT NULL,
  `status` enum('planned','open_for_candidates','on_stage','played','canceled') NOT NULL DEFAULT 'planned',
  `order_index` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ready` tinyint(1) NOT NULL DEFAULT 0,
  `cover_image` varchar(255) DEFAULT NULL,
  `extra_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_data`)),
  `catalog_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `jam_id` (`jam_id`),
  KEY `event_jam_songs_catalog_id_foreign_idx` (`catalog_id`),
  CONSTRAINT `event_jam_songs_catalog_id_foreign_idx` FOREIGN KEY (`catalog_id`) REFERENCES `event_jam_music_catalog` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `event_jam_songs_ibfk_1` FOREIGN KEY (`jam_id`) REFERENCES `event_jams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jam_songs` */

insert  into `event_jam_songs`(`id`,`id_code`,`jam_id`,`title`,`artist`,`key`,`tempo_bpm`,`notes`,`release_batch`,`status`,`order_index`,`created_at`,`updated_at`,`ready`,`cover_image`,`extra_data`,`catalog_id`) values 
(158,'ec4ae065-1b14-406d-8f7d-c9d01acea123',7,'Mulher da Fases','Raimundos',NULL,NULL,NULL,NULL,'open_for_candidates',1,'2026-01-10 00:19:48','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(159,'35a316c9-78db-42ee-9006-f2f60648a90e',7,'Here Without You','3 Doors Down',NULL,NULL,NULL,NULL,'open_for_candidates',2,'2026-01-10 00:22:20','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(160,'9e7064c4-40db-423d-94a1-ce02bda240f5',7,'Página de amigos','Menos é mais',NULL,NULL,NULL,NULL,'on_stage',1,'2026-01-10 00:24:48','2026-02-11 03:38:43',1,NULL,NULL,NULL),
(161,'2b4e8d0b-e625-471d-9381-5f53f506a37b',7,'Evidências','Chitãozinho e Xororó',NULL,NULL,NULL,NULL,'open_for_candidates',0,'2026-01-10 00:26:39','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(162,'4b47dbc7-a263-4258-91fe-c6abf93da406',7,'Evidências','Chitãozinho e Xororó',NULL,NULL,NULL,NULL,'open_for_candidates',3,'2026-01-10 00:26:42','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(163,'4d152303-f68e-430c-8afb-0c21c6128f29',7,'Péssimo negócio','Dilsinho',NULL,NULL,NULL,NULL,'open_for_candidates',4,'2026-01-10 00:27:55','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(164,'6136a9f4-bf81-4ab9-a215-ecf166ef149a',7,'Insegurança','Pixote',NULL,NULL,NULL,NULL,'open_for_candidates',5,'2026-01-10 00:28:46','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(165,'b6e493c4-11b7-4adc-9e41-1b0b140b059c',7,'Nosso primeiro beijo','Gloria Groove',NULL,NULL,NULL,NULL,'open_for_candidates',6,'2026-01-10 00:29:26','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(166,'0f029847-2ad3-4328-975d-c7014b8f6829',7,'Pintura íntima','Kid Abelha',NULL,NULL,NULL,NULL,'open_for_candidates',7,'2026-01-10 00:30:18','2026-02-11 03:38:43',0,NULL,NULL,NULL),
(167,'a6761979-a8f2-47ee-ae4f-88dc62b259ec',7,'Uma noite e meia','Marina',NULL,NULL,NULL,NULL,'on_stage',2,'2026-01-10 00:30:55','2026-02-11 03:38:44',1,NULL,NULL,NULL),
(168,'5c39139e-1c67-479d-9bcc-cd2d85375c27',7,'Vamos Fugir','Skunk',NULL,NULL,NULL,NULL,'on_stage',0,'2026-01-10 00:31:27','2026-02-11 03:38:44',1,NULL,NULL,NULL),
(169,'b4c2977b-bfa8-4007-9085-c0dfbcd3bf43',7,'Palpite','Vanessa Rangel',NULL,NULL,NULL,NULL,'on_stage',3,'2026-01-10 00:32:50','2026-02-11 03:38:44',1,NULL,NULL,NULL),
(170,'953c30a3-9fc5-4745-b207-399a43b00cd1',7,'Beija eu','Marisa Monte',NULL,NULL,NULL,NULL,'open_for_candidates',8,'2026-01-10 00:33:22','2026-02-11 03:38:44',0,NULL,NULL,NULL),
(203,'78f59168-0442-4d2d-a676-897114546e85',6,'The Police','The Police',NULL,NULL,NULL,NULL,'on_stage',0,'2026-02-25 20:22:55','2026-02-25 20:23:32',1,NULL,NULL,NULL),
(208,'081e4c75-3a94-46d0-82a6-650d3ecbd7e9',6,'Nevermind','Nirvana',NULL,NULL,NULL,NULL,'on_stage',9,'2026-02-25 20:55:05','2026-02-27 04:15:59',1,'https://i.discogs.com/uCeQtLv9OSNjC5_AjarCojZNepI9vqcnYeqsImnzXyg/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTcwOTcw/NTEtMTU1NjQ0NDE4/MC03NTA1LmpwZWc.jpeg',NULL,3),
(209,'a49991f8-d8a4-484e-8360-1ed307350792',6,'Eagle Fly Free','Helloween',NULL,NULL,NULL,NULL,'on_stage',1,'2026-02-25 20:55:40','2026-02-27 04:16:11',1,'https://i.discogs.com/Ios1rX23sMnCG0FTezNiYknRVwoasIMRynupI3CUjlI/rs:fit/g:sm/q:90/h:450/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk5MDQ1/MjItMTQ4ODI4NDg4/Ny02NTU2LmpwZWc.jpeg',NULL,4),
(210,'209c08b2-0557-476e-b76f-414363b0df5e',6,'Sgt. Pepper\'s Lonely Hearts Club Band','The Beatles',NULL,NULL,NULL,NULL,'on_stage',5,'2026-02-26 08:54:58','2026-02-27 02:33:21',1,'https://i.discogs.com/oTQaA8Qx54QYKqW1tREPrzDBX7oh5Tpc_gSlSUgCof8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTkyNjkz/MTUtMTQ3NzY5Mjc5/My0yNjMxLmpwZWc.jpeg',NULL,5),
(211,'d9975d62-f18e-4afe-b712-b1ccc26c595b',6,'MTV Ao Vivo Volume 01','Raimundos',NULL,NULL,NULL,NULL,'on_stage',7,'2026-02-26 08:56:36','2026-02-27 02:33:56',1,'https://i.discogs.com/HSwkjmAnF0iolbIzyIysc5nsXzixkbpSovgOWM1lIhQ/rs:fit/g:sm/q:90/h:598/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk0MDc0/MDAtMTQ4MDAyMjIy/Ny01MjczLmpwZWc.jpeg',NULL,6),
(212,'cbbaf211-0d01-4365-9bb9-8b1ee785f608',6,'Roots','Sepultura',NULL,NULL,NULL,NULL,'on_stage',2,'2026-02-26 08:57:49','2026-02-27 04:16:11',1,'https://i.discogs.com/MgeMe0tWEbWjVPyLHt76xCoeYUJJ1AgVrz8c1jbTJA0/rs:fit/g:sm/q:90/h:592/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExMDg4/Mzk5LTE2MTMwMjM2/NDctNTkyMC5qcGVn.jpeg',NULL,7),
(213,'da55a476-8832-4c00-9f1e-407341dfd767',6,'Visions','Stratovarius',NULL,NULL,NULL,NULL,'on_stage',4,'2026-02-26 08:58:33','2026-02-27 03:07:18',1,'https://i.discogs.com/p4aYNfs8E-b2VkmuWLs0DWfioYmBQ4tAozY9KBK6Tgc/rs:fit/g:sm/q:90/h:486/w:541/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwODAy/MDMtMTcxNTY4MTQy/MC00NTUzLmpwZWc.jpeg',NULL,8),
(214,'2e7c4691-8cfe-4e24-a12f-f89554e2ae4a',6,'The Dark Side Of The Moon','Pink Floyd',NULL,NULL,NULL,NULL,'on_stage',3,'2026-02-26 08:59:47','2026-02-27 04:16:11',1,'https://i.discogs.com/1fwskTLM6cfxbdNmBDJ8expl6wab0tEgxvuloLIqKh8/rs:fit/g:sm/q:90/h:596/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTkyODc4/MDktMTQ3OTc1MzIz/Ni05NjE3LmpwZWc.jpeg',NULL,9),
(215,'9ac3ba16-aab1-43b9-bb74-38fd798d4ade',6,'Pearl Jam','Pearl Jam',NULL,NULL,NULL,NULL,'on_stage',8,'2026-02-26 09:00:46','2026-02-27 03:06:33',1,'https://i.discogs.com/7f0e3GsdCSMk3VmkgYeFCgTViDCztuoTg-AnaT8AA7s/rs:fit/g:sm/q:90/h:535/w:597/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzMTc2/NTMtMTIwOTE4NDMz/MC5qcGVn.jpeg',NULL,10),
(216,'f1a36692-ebfd-4f10-99de-6af523fdd2d9',6,'Ten','Pearl Jam',NULL,NULL,NULL,NULL,'on_stage',12,'2026-02-26 09:01:47','2026-02-27 04:16:04',1,'https://i.discogs.com/QC8HQ8n--58VZuE6Ikz0MRb0E1HtOFfLyG0KTSQkH3Y/rs:fit/g:sm/q:90/h:603/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExMTE2/NDUxLTE1MTE1Mzk0/MTYtMzkyMi5qcGVn.jpeg',NULL,11),
(217,'b307f1eb-b5cd-41a4-bde1-d4135ecc2861',6,'GHV2 (Greatest Hits Volume 2)','Madonna',NULL,NULL,NULL,NULL,'on_stage',13,'2026-02-26 09:02:19','2026-02-27 04:15:54',1,'https://i.discogs.com/sokqmcJ-Un2lkUo20BE3ejWrfJLAk_RWJmGIEopnckI/rs:fit/g:sm/q:90/h:310/w:310/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzNjM2/ODMtMTM0NTAzMzM0/OS00MzM4LmpwZWc.jpeg',NULL,12),
(218,'65fce3b8-b19a-4576-a2af-46a0dd7fdd7d',6,'Unplugged','R.E.M.',NULL,NULL,NULL,NULL,'on_stage',11,'2026-02-26 09:03:04','2026-02-27 04:16:04',1,'https://i.discogs.com/0pQc1Fp2spbsSeXZypcEf_H2_Rt1irS2bZ6yQvzviW0/rs:fit/g:sm/q:90/h:480/w:477/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY4MjU2/NTQtMTQyNzQxOTQw/My00MzQzLmpwZWc.jpeg',NULL,13),
(219,'59549d12-3451-49b7-87af-2408a50e5465',6,'The Beatles','The Beatles',NULL,NULL,NULL,NULL,'on_stage',10,'2026-02-26 09:07:58','2026-02-27 04:16:04',1,'https://i.discogs.com/gOfsu0ld4NfpUoE9c5qO3-Uqx-mWjTv-YGud-LyTUFI/rs:fit/g:sm/q:90/h:464/w:465/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0MzY0/NDUtMTIzMzY5Nzgx/Ny5qcGVn.jpeg',NULL,NULL),
(220,'19d15fd8-6df9-4e88-99c6-934827d95d54',6,'Foo Fighters','Foo Fighters',NULL,NULL,NULL,NULL,'on_stage',6,'2026-02-26 22:44:23','2026-02-27 02:33:56',1,'https://i.discogs.com/M_QNya94MpMhPXeKW1_qjHT-vzoz8UubLokyzNCbrvo/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMyNDI2/MTItMTQyODA5NTM3/OS0yNDUzLmpwZWc.jpeg',NULL,14),
(222,'1eccba08-0114-42cd-82ad-9afce57bb925',6,'Beatles For Sale','The Beatles',NULL,NULL,NULL,NULL,'open_for_candidates',0,'2026-02-27 05:01:20','2026-02-27 05:01:24',0,'https://i.discogs.com/QdKth0XB-lh88VU1qMTF56xMAh-GvYCAlZLYxeQvW0Y/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEwMjEw/NDMxLTE0OTM0NjAx/NDAtMzA3OS5qcGVn.jpeg',NULL,15),
(223,'192fcd0e-462e-4823-9505-ae9eb586bee1',6,'Fagner & Zeca Baleiro','Raimundo Fagner & Zeca Baleiro',NULL,NULL,NULL,NULL,'planned',0,'2026-02-27 05:12:49','2026-02-27 05:12:49',0,'https://i.discogs.com/L0sleo-SJkTWiEuR1qfFMaPT02RIOtu_bd2C-F8xCpc/rs:fit/g:sm/q:90/h:388/w:430/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExNzM1/ODA1LTE1MjE0OTI0/MzYtMzIxOS5qcGVn.jpeg',NULL,16);

/*Table structure for table `event_jams` */

DROP TABLE IF EXISTS `event_jams`;

CREATE TABLE `event_jams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(36) NOT NULL,
  `event_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('active','finished','canceled') NOT NULL DEFAULT 'active',
  `order_index` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_jams_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_jams` */

insert  into `event_jams`(`id`,`id_code`,`event_id`,`name`,`slug`,`notes`,`status`,`order_index`,`created_at`,`updated_at`) values 
(6,'64e8b51f-6afe-41a9-9693-54ed139ec6bb',33,'Vibe Sessions','jam-vibe-sessions',NULL,'active',0,'2026-01-06 09:37:13','2026-02-11 02:29:44'),
(7,'0f194584-6021-4fba-b9c2-a2e9736a2790',36,'Erick’s Open mic Birthday','jam-erick-s-open-mic-birthday',NULL,'active',0,'2026-01-10 00:19:48','2026-02-11 02:29:44');

/*Table structure for table `event_questions` */

DROP TABLE IF EXISTS `event_questions`;

CREATE TABLE `event_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('text','textarea','radio','checkbox','rating','music_preference','auto_checkin') NOT NULL DEFAULT 'text',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `max_choices` int(11) DEFAULT NULL,
  `correct_option_index` int(11) DEFAULT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT 1,
  `show_results` tinyint(1) NOT NULL DEFAULT 1,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_public` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Define se a pergunta é visível/respondível para usuários não autenticados',
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_questions_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_questions` */

insert  into `event_questions`(`id`,`event_id`,`question_text`,`question_type`,`options`,`max_choices`,`correct_option_index`,`is_required`,`show_results`,`order_index`,`created_at`,`is_public`) values 
(47,36,'What songs would you like to Jam with other musicias','textarea',NULL,NULL,NULL,0,0,1,'2026-01-10 00:06:33',0),
(48,36,'What instruments do you play?','text',NULL,NULL,NULL,1,0,2,'2026-01-10 00:07:21',0),
(49,36,'What is your Instagram profile?','text',NULL,NULL,NULL,1,0,3,'2026-01-10 00:08:18',0),
(50,36,'What is your email to send the event photos and videos?','text',NULL,NULL,NULL,1,0,4,'2026-01-10 00:08:53',0);

/*Table structure for table `event_responses` */

DROP TABLE IF EXISTS `event_responses`;

CREATE TABLE `event_responses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `guest_code` varchar(255) NOT NULL COMMENT 'Pode ser um código curto ou o id_code (UUID) do usuário',
  `selfie_url` varchar(500) DEFAULT NULL,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL COMMENT 'Usuário autenticado autor da resposta, quando aplicável',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_event_guest_code` (`event_id`,`guest_code`),
  UNIQUE KEY `uniq_event_user` (`event_id`,`user_id`),
  KEY `event_responses_user_id_foreign_idx` (`user_id`),
  CONSTRAINT `event_responses_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_responses_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `event_responses` */

insert  into `event_responses`(`id`,`event_id`,`guest_code`,`selfie_url`,`submitted_at`,`user_id`) values 
(37,33,'OMQL39NO','http://localhost:4000/api/v1/files/1ZndD2-yy8gPLJWznZz5VoKMpe6Jk-y1c','2026-01-08 21:03:46',26),
(38,33,'YVRYJ8XY','https://beerclub-api.onrender.com/api/v1/files/1H_PnNC9KkgiaJg1RSB-kNUdSrmpnKOiH','2026-01-08 21:13:05',10),
(39,33,'AK4QHGBO','https://beerclub-api.onrender.com/api/v1/files/1SBnuxiwKQWkTocX3fRM3cFMFfTSETMSP','2026-01-08 21:34:30',22),
(40,33,'NKGD9AJX','https://beerclub-api.onrender.com/api/v1/files/13VM13VXo_pVjD87KW8aa-BSoS_4Kfu6G','2026-01-09 22:06:25',27),
(41,36,'ATC3W36C','https://beerclub-api.onrender.com/api/v1/files/1AOxujRn389jlbKt6hq70emIWyNF75G5Z','2026-01-10 00:13:02',27),
(42,36,'1LYR7JWN','https://beerclub-api.onrender.com/api/v1/files/1EItIjjtqM4JatHRNXj5PbaiHjh_h__D2','2026-01-10 00:40:25',10),
(43,36,'a1d68bb3-829e-4843-9ade-6edd88b78902',NULL,'2026-01-10 00:51:17',31),
(44,36,'WJYUTMNB','https://beerclub-api.onrender.com/api/v1/files/1ZVed0xrkmFI0IbDFifHnYAtaTifcvFZB','2026-01-10 01:00:19',22),
(45,36,'c821b997-7048-4b2e-8de6-937fc6243003',NULL,'2026-01-10 02:14:10',34),
(48,36,'c3cbbe6b-0102-4aed-a391-4c67d8cd9a32',NULL,'2026-01-10 02:28:05',35),
(49,36,'58788ba9-d791-4d16-993f-fd40bf9bc626',NULL,'2026-01-10 02:47:24',36),
(50,36,'dd533d17-d90a-41f7-9ead-4af548776eb5',NULL,'2026-01-10 04:13:37',33),
(52,36,'e9af7123-f6b6-46b8-852b-c1a5235a4369',NULL,'2026-01-10 05:06:22',37),
(53,36,'db4fa13b-cc6d-4ce1-a9d8-916f43a17b81',NULL,'2026-01-10 06:01:20',38);

/*Table structure for table `events` */

DROP TABLE IF EXISTS `events`;

CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `banner_url` varchar(500) DEFAULT NULL,
  `start_datetime` datetime DEFAULT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `public_url` varchar(500) DEFAULT NULL,
  `gallery_url` varchar(500) DEFAULT NULL,
  `place` varchar(255) DEFAULT NULL,
  `resp_email` varchar(255) DEFAULT NULL,
  `resp_name` varchar(255) DEFAULT NULL,
  `resp_phone` varchar(20) DEFAULT NULL,
  `color_1` varchar(50) DEFAULT NULL,
  `color_2` varchar(50) DEFAULT NULL,
  `card_background` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `id_code` varchar(255) NOT NULL,
  `card_background_type` tinyint(4) DEFAULT NULL COMMENT '0=cores (gradient), 1=imagem',
  `auto_checkin` tinyint(1) NOT NULL DEFAULT 0,
  `requires_auto_checkin` tinyint(1) NOT NULL DEFAULT 0,
  `auto_checkin_flow_quest` tinyint(1) NOT NULL DEFAULT 0,
  `checkin_component_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`checkin_component_config`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `id_code_2` (`id_code`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `events` */

insert  into `events`(`id`,`name`,`slug`,`banner_url`,`start_datetime`,`end_datetime`,`created_by`,`description`,`public_url`,`gallery_url`,`place`,`resp_email`,`resp_name`,`resp_phone`,`color_1`,`color_2`,`card_background`,`created_at`,`updated_at`,`deleted_at`,`id_code`,`card_background_type`,`auto_checkin`,`requires_auto_checkin`,`auto_checkin_flow_quest`,`checkin_component_config`) values 
(33,'Vibe Sessions','vibe-sessions','https://beerclub-api.onrender.com/api/v1/files/1x8nB5EGHatm3wzzHlYr4Jx8h0wnLQOdN','2026-01-10 09:35:00','2026-01-11 02:35:00',10,'Aniversário do Erick',NULL,NULL,'Austrália','adasd@asda.com','dasdasdas','1111111','#3B82F6','#1E40AF','http://localhost:4201/images/cards/event3.jpg','2026-01-06 09:36:29','2026-01-17 18:41:11',NULL,'6e676bb1-78a2-48d2-b4a3-73591ba86b7b',1,0,1,0,NULL),
(34,'EVENTO TESTE','evento-teste','https://beerclub-api.onrender.com/api/v1/files/1RQVy00wsboDvtzLskA4AAYo7YwYfWxBF','2026-01-08 19:15:00','2026-01-09 19:15:00',10,'sadasd',NULL,NULL,'asdad','asda@asda.com','asdasd','12323','#3B82F6','#1E40AF','https://vibe-sessions-ui.onrender.com/images/cards/event4.jpg','2026-01-08 19:15:40','2026-01-08 19:15:46',NULL,'28d3e8b2-fde8-4ecd-b294-dbebb2f67925',1,0,1,0,NULL),
(35,'TESTE2','teste2','http://localhost:4000/api/v1/files/1hXkPQCyRE895t08dpxrl2lQh2lsbxxyx','2026-01-08 19:20:00','2026-01-09 19:20:00',10,'asdasd',NULL,NULL,'assad','asd@asddsa.com','asdd','123212312323','#3B82F6','#1E40AF','http://localhost:4201/images/cards/event3.jpg','2026-01-08 19:20:57','2026-01-08 20:59:05',NULL,'b73badcb-1237-48c2-8f46-c75365ed3a48',1,0,1,0,NULL),
(36,'Erick’s Open mic Birthday','erick-s-open-mic-birthday','https://beerclub-api.onrender.com/api/v1/files/144hVry4MozyVAgdWpPKjmS8hmVhnHQw1','2026-01-10 07:30:00','2026-01-10 11:00:00',27,'Let’s make music, let’s celebrate life',NULL,NULL,'The Soda Factory - Sydney','emarquez.eng@gmail.com','Erick Marquez','0451499712','#3B82F6','#1E40AF','https://vibe-sessions-ui.onrender.com/images/cards/event4.jpg','2026-01-10 00:03:32','2026-01-10 00:03:40',NULL,'88e2718d-44c3-47c4-b92f-8f9e4956aa09',1,0,1,1,NULL);

/*Table structure for table `fin_accounts_payable` */

DROP TABLE IF EXISTS `fin_accounts_payable`;

CREATE TABLE `fin_accounts_payable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` char(36) NOT NULL DEFAULT uuid(),
  `store_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `invoice_number` varchar(64) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` char(3) DEFAULT 'BRL',
  `issue_date` date DEFAULT NULL,
  `due_date` date NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  `status` enum('pending','approved','scheduled','paid','overdue','canceled') DEFAULT 'pending',
  `category` varchar(64) DEFAULT NULL,
  `cost_center` varchar(64) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `unique_vendor_invoice` (`vendor_id`,`invoice_number`),
  KEY `created_by` (`created_by`),
  KEY `approved_by` (`approved_by`),
  KEY `fin_accounts_payable_store_id` (`store_id`),
  KEY `fin_accounts_payable_vendor_id` (`vendor_id`),
  KEY `fin_accounts_payable_status` (`status`),
  KEY `fin_accounts_payable_due_date` (`due_date`),
  KEY `fin_accounts_payable_id_code` (`id_code`),
  KEY `fin_accounts_payable_paid_at` (`paid_at`),
  CONSTRAINT `fin_accounts_payable_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fin_accounts_payable_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `fin_vendors` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fin_accounts_payable_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fin_accounts_payable_ibfk_4` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_accounts_payable` */

/*Table structure for table `fin_accounts_receivable` */

DROP TABLE IF EXISTS `fin_accounts_receivable`;

CREATE TABLE `fin_accounts_receivable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` char(36) NOT NULL DEFAULT uuid(),
  `store_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `invoice_number` varchar(64) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` char(3) DEFAULT 'BRL',
  `issue_date` date DEFAULT NULL,
  `due_date` date NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  `status` enum('pending','paid','overdue','canceled','partial') DEFAULT 'pending',
  `salesperson_id` int(11) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `unique_customer_invoice` (`customer_id`,`invoice_number`),
  KEY `salesperson_id` (`salesperson_id`),
  KEY `created_by` (`created_by`),
  KEY `fin_accounts_receivable_store_id` (`store_id`),
  KEY `fin_accounts_receivable_customer_id` (`customer_id`),
  KEY `fin_accounts_receivable_status` (`status`),
  KEY `fin_accounts_receivable_due_date` (`due_date`),
  KEY `fin_accounts_receivable_id_code` (`id_code`),
  CONSTRAINT `fin_accounts_receivable_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fin_accounts_receivable_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `fin_customers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fin_accounts_receivable_ibfk_3` FOREIGN KEY (`salesperson_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fin_accounts_receivable_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_accounts_receivable` */

/*Table structure for table `fin_bank_accounts` */

DROP TABLE IF EXISTS `fin_bank_accounts`;

CREATE TABLE `fin_bank_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Nome de identificação da conta (ex: Conta Principal)',
  `bank_name` varchar(255) NOT NULL,
  `bank_code` varchar(10) DEFAULT NULL,
  `agency` varchar(20) NOT NULL,
  `account_number` varchar(30) NOT NULL,
  `account_digit` varchar(5) DEFAULT NULL,
  `type` enum('checking','savings','investment','payment','other') NOT NULL DEFAULT 'checking',
  `initial_balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `store_id` varchar(255) DEFAULT NULL COMMENT 'Stores the id_code (UUID) of the store',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `allowed_payment_methods` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'List of allowed payment methods for this account (e.g., ["pix", "checking"])' CHECK (json_valid(`allowed_payment_methods`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `bank_accounts_id_code` (`id_code`),
  KEY `bank_accounts_store_id` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_bank_accounts` */

insert  into `fin_bank_accounts`(`id`,`id_code`,`name`,`bank_name`,`bank_code`,`agency`,`account_number`,`account_digit`,`type`,`initial_balance`,`store_id`,`is_active`,`is_default`,`created_by`,`created_at`,`updated_at`,`allowed_payment_methods`) values 
(1,'bk-c4b4ea3b-e97b-4c89-b1dd-12c3165d0747','MEI - DMEDIA','nubank',NULL,'001','7878781',NULL,'savings',5000.00,'d1b685fd-d18a-4ee6-aa07-293bb66117f3',1,1,10,'2026-01-20 04:16:03','2026-01-23 05:44:09','[\"boleto\",\"bank_transfer\",\"debit_card\",\"pix\"]'),
(2,'bk-74ce6c74-0580-45b7-885b-0104057ac727','CAIXA-INTERNO','interno',NULL,'0','0',NULL,'other',1000.00,'d1b685fd-d18a-4ee6-aa07-293bb66117f3',1,0,10,'2026-01-20 15:27:28','2026-01-23 05:31:30','[\"cash\"]'),
(4,'bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0','SANTANDER','Santander',NULL,'02','000',NULL,'checking',0.00,'d1b685fd-d18a-4ee6-aa07-293bb66117f3',1,0,10,'2026-01-20 17:54:19','2026-01-23 05:42:11','[\"debit_card\",\"pix\",\"bank_transfer\",\"boleto\"]'),
(9,'bk-0de9dc44-5628-4082-965a-dede9363cf54','VISA','VISA',NULL,'0','000000',NULL,'other',0.00,'d1b685fd-d18a-4ee6-aa07-293bb66117f3',1,0,10,'2026-01-23 05:32:09','2026-01-23 05:32:09','[\"credit_card\"]');

/*Table structure for table `fin_categories` */

DROP TABLE IF EXISTS `fin_categories`;

CREATE TABLE `fin_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `store_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('payable','receivable') NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `fin_categories_store_id` (`store_id`),
  KEY `fin_categories_type` (`type`),
  KEY `fin_categories_id_code` (`id_code`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_categories` */

insert  into `fin_categories`(`id`,`id_code`,`store_id`,`name`,`type`,`color`,`icon`,`status`,`created_at`,`updated_at`) values 
(1,'cat-05d2f649-569e-4c42-abba-332d8618122e','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Casa','payable',NULL,NULL,'active','2026-01-20 22:24:22','2026-01-20 22:24:22'),
(2,'cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Alimentação','payable',NULL,NULL,'active','2026-01-20 22:24:49','2026-01-20 22:24:49'),
(3,'cat-048574e6-31f7-4b7a-bcfb-b6e4e5cf3104','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Suporte','payable',NULL,NULL,'inactive','2026-01-20 22:25:17','2026-01-21 00:06:36'),
(4,'cat-448b22c8-acbb-4394-ba99-9af9ba79c157','d1b685fd-d18a-4ee6-aa07-293bb66117f3','salário','payable',NULL,NULL,'inactive','2026-01-20 22:27:59','2026-01-21 00:06:17'),
(5,'cat-75167c0f-cd0a-4ef7-9731-295cdd2eaf45','d1b685fd-d18a-4ee6-aa07-293bb66117f3','salario3','payable',NULL,NULL,'inactive','2026-01-20 22:31:05','2026-01-21 00:06:12'),
(6,'cat-72737538-8fcf-4332-b36e-7e5650d64336','d1b685fd-d18a-4ee6-aa07-293bb66117f3','receita','payable',NULL,NULL,'inactive','2026-01-20 22:32:06','2026-01-21 00:05:57'),
(7,'cat-0da24f01-112f-49fd-93f3-591462df96cd','d1b685fd-d18a-4ee6-aa07-293bb66117f3','despesa','payable',NULL,NULL,'active','2026-01-20 22:32:23','2026-01-20 22:32:23'),
(8,'cat-7cfae013-4b16-4fa3-b2d9-f0a99dd206d2','d1b685fd-d18a-4ee6-aa07-293bb66117f3','receita','payable',NULL,NULL,'inactive','2026-01-20 22:36:04','2026-01-21 00:06:50'),
(9,'cat-da2e585a-cb02-4b42-8235-ff8081b9171e','d1b685fd-d18a-4ee6-aa07-293bb66117f3','receita','payable',NULL,NULL,'inactive','2026-01-20 22:36:19','2026-01-21 00:06:21'),
(10,'cat-3403121f-0aa3-4039-bd1e-e179be3aefe6','d1b685fd-d18a-4ee6-aa07-293bb66117f3','despesa','payable',NULL,NULL,'inactive','2026-01-20 22:36:28','2026-01-21 00:06:26'),
(11,'cat-e6b50781-92b7-4f0a-bede-c06469075a2d','d1b685fd-d18a-4ee6-aa07-293bb66117f3','receita','receivable',NULL,NULL,'active','2026-01-20 22:39:53','2026-01-20 22:39:53'),
(12,'cat-9ee3b86d-4368-470e-9f75-61968fd3d72c','store-123','Test Cat','payable',NULL,NULL,'active','2026-01-20 23:25:51','2026-01-20 23:25:51'),
(13,'cat-5633ad0e-1e50-4beb-ad2f-b54b9feaebfc','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Vendas','receivable',NULL,NULL,'active','2026-01-21 00:47:37','2026-01-21 00:47:37'),
(14,'cat-a262c946-a2fd-4f5e-9c46-79ec580a0a28','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Serviços','receivable',NULL,NULL,'active','2026-01-21 00:47:50','2026-01-21 00:47:50'),
(15,'cat-632f065b-39ee-4cff-9ab0-22a00c499819','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Aluguel','payable',NULL,NULL,'active','2026-01-21 00:48:03','2026-01-21 00:48:03'),
(16,'cat-fa80ba99-311a-47ed-b3cf-9876bbeff31b','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Fornecedores','payable',NULL,NULL,'active','2026-01-21 00:48:11','2026-01-21 00:48:11'),
(17,'cat-f45b6653-438c-45ba-b491-501642d93faa','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Marketing','payable',NULL,NULL,'active','2026-01-21 00:48:19','2026-01-21 00:48:19');

/*Table structure for table `fin_cost_centers` */

DROP TABLE IF EXISTS `fin_cost_centers`;

CREATE TABLE `fin_cost_centers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `store_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `fin_cost_centers_store_id` (`store_id`),
  KEY `fin_cost_centers_id_code` (`id_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_cost_centers` */

insert  into `fin_cost_centers`(`id`,`id_code`,`store_id`,`name`,`code`,`description`,`status`,`created_at`,`updated_at`) values 
(1,'cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Administrativo','ADM-1',NULL,'active','2026-01-21 00:07:28','2026-01-21 00:07:28'),
(2,'cc-a095ac61-4af9-4ab9-baf4-9a3281fc8994','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Operacional','OP-2',NULL,'active','2026-01-21 00:07:43','2026-01-21 00:07:43'),
(3,'cc-a92ff880-b764-44d2-beb1-c91283ee92f8','d1b685fd-d18a-4ee6-aa07-293bb66117f3','teste','teste',NULL,'inactive','2026-01-21 00:07:57','2026-01-21 00:08:05');

/*Table structure for table `fin_customers` */

DROP TABLE IF EXISTS `fin_customers`;

CREATE TABLE `fin_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` char(36) NOT NULL DEFAULT uuid(),
  `store_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `document` varchar(32) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `idx_fin_customers_store_id` (`store_id`),
  KEY `idx_fin_customers_document` (`document`),
  KEY `idx_fin_customers_id_code` (`id_code`),
  CONSTRAINT `fin_customers_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_customers` */

/*Table structure for table `fin_parties` */

DROP TABLE IF EXISTS `fin_parties`;

CREATE TABLE `fin_parties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `store_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `trade_name` varchar(255) DEFAULT NULL,
  `document` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `is_customer` tinyint(1) DEFAULT 0,
  `is_supplier` tinyint(1) DEFAULT 0,
  `is_employee` tinyint(1) DEFAULT 0,
  `is_salesperson` tinyint(1) DEFAULT 0,
  `zip_code` varchar(10) DEFAULT NULL,
  `address_street` varchar(255) DEFAULT NULL,
  `address_number` varchar(20) DEFAULT NULL,
  `address_complement` varchar(255) DEFAULT NULL,
  `address_neighborhood` varchar(255) DEFAULT NULL,
  `address_city` varchar(255) DEFAULT NULL,
  `address_state` varchar(2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('active','inactive','blocked') DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `fin_parties_store_id` (`store_id`),
  KEY `fin_parties_id_code` (`id_code`),
  KEY `fin_parties_document` (`document`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_parties` */

insert  into `fin_parties`(`id`,`id_code`,`store_id`,`name`,`trade_name`,`document`,`email`,`phone`,`mobile`,`is_customer`,`is_supplier`,`is_employee`,`is_salesperson`,`zip_code`,`address_street`,`address_number`,`address_complement`,`address_neighborhood`,`address_city`,`address_state`,`notes`,`status`,`created_by`,`created_at`,`updated_at`) values 
(1,'pty-2f69634e-0422-4ab9-841e-56bf6aa7b82f','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Davis Vasconcellos','Davis Vasconcellos','111111','davisvasconcellos@gmail.com','11111',NULL,1,1,0,0,'21911230',NULL,NULL,NULL,'Freguesia (Ilha do Governador)','Rio de Janeiro','rj','teste','active',10,'2026-01-20 20:57:48','2026-01-20 20:57:48'),
(2,'pty-5a25c143-3dbf-47f5-a835-77d6a47c26e2','d1b685fd-d18a-4ee6-aa07-293bb66117f3','Davis Vasconcellos2','Davis Vasconcellos2','33343444','davisvasconcellos@gmail.com','21965445992','4444444444',1,1,0,0,'21911-430','Rua Magno Martins','209','202','Freguesia (Ilha do Governador)','Rio de Janeiro','RJ','dddddd','active',10,'2026-01-20 21:29:18','2026-01-20 21:29:18'),
(3,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6','d1b685fd-d18a-4ee6-aa07-293bb66117f3','cliente 3','Client 3','33455','eee@jdjd.com','777','09090',1,0,1,0,'22271-020','Rua Conde de Irajá','532','444','Botafogo','Rio de Janeiro','RJ',NULL,'active',10,'2026-01-20 21:42:14','2026-01-20 21:42:14');

/*Table structure for table `fin_payments` */

DROP TABLE IF EXISTS `fin_payments`;

CREATE TABLE `fin_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payable_id` int(11) DEFAULT NULL,
  `receivable_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paid_at` datetime NOT NULL,
  `method` enum('pix','bank_transfer','cash','card','deposit') NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `fin_payments_payable_id` (`payable_id`),
  KEY `fin_payments_receivable_id` (`receivable_id`),
  KEY `fin_payments_paid_at` (`paid_at`),
  CONSTRAINT `fin_payments_ibfk_1` FOREIGN KEY (`payable_id`) REFERENCES `fin_accounts_payable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fin_payments_ibfk_2` FOREIGN KEY (`receivable_id`) REFERENCES `fin_accounts_receivable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fin_payments_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_payments` */

/*Table structure for table `fin_recurrences` */

DROP TABLE IF EXISTS `fin_recurrences`;

CREATE TABLE `fin_recurrences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `store_id` varchar(255) NOT NULL COMMENT 'Stores the id_code (UUID) of the store',
  `type` enum('PAYABLE','RECEIVABLE','TRANSFER') NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL COMMENT 'Estimated or fixed amount',
  `frequency` enum('weekly','monthly','yearly') NOT NULL DEFAULT 'monthly',
  `status` enum('active','paused','finished') NOT NULL DEFAULT 'active',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `next_due_date` date NOT NULL,
  `day_of_month` int(11) NOT NULL,
  `party_id` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `cost_center_id` varchar(255) DEFAULT NULL,
  `created_by_user_id` int(11) NOT NULL,
  `updated_by_user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `created_by_user_id` (`created_by_user_id`),
  KEY `updated_by_user_id` (`updated_by_user_id`),
  KEY `fin_recurrences_store_id` (`store_id`),
  KEY `fin_recurrences_status` (`status`),
  KEY `fin_recurrences_next_due_date` (`next_due_date`),
  CONSTRAINT `fin_recurrences_ibfk_1` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fin_recurrences_ibfk_2` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_recurrences` */

insert  into `fin_recurrences`(`id`,`id_code`,`store_id`,`type`,`description`,`amount`,`frequency`,`status`,`start_date`,`end_date`,`next_due_date`,`day_of_month`,`party_id`,`category_id`,`cost_center_id`,`created_by_user_id`,`updated_by_user_id`,`created_at`,`updated_at`) values 
(4,'rec-67aa42a0-5608-4f83-a7de-dfeff31781ed','d1b685fd-d18a-4ee6-aa07-293bb66117f3','PAYABLE','aluguel',100.00,'monthly','active','2026-01-21',NULL,'2026-03-05',5,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6','cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',10,10,'2026-01-21 09:24:51','2026-02-26 03:05:00'),
(5,'rec-76d403f5-ea4e-4d12-a23b-fedd0ff24561','d1b685fd-d18a-4ee6-aa07-293bb66117f3','PAYABLE','Light',100.00,'monthly','active','2026-01-01',NULL,'2026-03-05',5,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6','cat-05d2f649-569e-4c42-abba-332d8618122e','cc-a095ac61-4af9-4ab9-baf4-9a3281fc8994',10,10,'2026-01-21 09:26:47','2026-02-26 03:05:00'),
(6,'rec-aa65628a-e54a-4953-9190-9db01038473e','d1b685fd-d18a-4ee6-aa07-293bb66117f3','RECEIVABLE','sdddd',1000.00,'monthly','active','2026-01-23','2026-07-31','2026-03-05',5,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6','cat-05d2f649-569e-4c42-abba-332d8618122e','cc-a095ac61-4af9-4ab9-baf4-9a3281fc8994',10,NULL,'2026-01-21 20:36:40','2026-02-26 03:05:00');

/*Table structure for table `fin_tags` */

DROP TABLE IF EXISTS `fin_tags`;

CREATE TABLE `fin_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `store_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `fin_tags_store_id` (`store_id`),
  KEY `fin_tags_id_code` (`id_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_tags` */

insert  into `fin_tags`(`id`,`id_code`,`store_id`,`name`,`color`,`status`,`created_at`,`updated_at`) values 
(1,'tag-16e94775-cc47-45e4-b353-7b9a2846be80','d1b685fd-d18a-4ee6-aa07-293bb66117f3','davis','#3B82F6','active','2026-01-21 00:08:28','2026-01-21 00:08:28'),
(2,'tag-00723eb7-a38b-41c8-b986-5effaac81f92','d1b685fd-d18a-4ee6-aa07-293bb66117f3','reembolso','#c858ca','active','2026-01-21 00:08:42','2026-01-21 00:08:42'),
(3,'tag-c46bb938-886b-49ca-9409-7260a48b26e8','d1b685fd-d18a-4ee6-aa07-293bb66117f3','alimentação','#e02929','active','2026-01-21 00:17:30','2026-01-21 00:17:46'),
(4,'tag-39bb3231-338f-4209-9663-e59497642e87','d1b685fd-d18a-4ee6-aa07-293bb66117f3','teste','#0acb06','inactive','2026-01-21 00:18:17','2026-01-21 00:18:21');

/*Table structure for table `fin_transaction_tags` */

DROP TABLE IF EXISTS `fin_transaction_tags`;

CREATE TABLE `fin_transaction_tags` (
  `transaction_id` varchar(255) NOT NULL,
  `tag_id` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`transaction_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `fin_transaction_tags_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `fin_transactions` (`id_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fin_transaction_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `fin_tags` (`id_code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_transaction_tags` */

insert  into `fin_transaction_tags`(`transaction_id`,`tag_id`,`created_at`,`updated_at`) values 
('txn-05179ffd-6678-421c-8faf-d2c826dbd783','tag-16e94775-cc47-45e4-b353-7b9a2846be80','2026-01-22 22:23:39','2026-01-22 22:23:39'),
('txn-11702a18-9159-4e4c-82fd-99af719000da','tag-00723eb7-a38b-41c8-b986-5effaac81f92','2026-01-21 02:38:03','2026-01-21 02:38:03'),
('txn-11702a18-9159-4e4c-82fd-99af719000da','tag-16e94775-cc47-45e4-b353-7b9a2846be80','2026-01-21 02:38:03','2026-01-21 02:38:03'),
('txn-11702a18-9159-4e4c-82fd-99af719000da','tag-c46bb938-886b-49ca-9409-7260a48b26e8','2026-01-21 02:38:03','2026-01-21 02:38:03'),
('txn-aec3bc92-e262-4c87-828d-5a77018c9354','tag-c46bb938-886b-49ca-9409-7260a48b26e8','2026-01-23 06:12:46','2026-01-23 06:12:46'),
('txn-c9356284-ca07-4802-a415-4d4ebf5642e7','tag-c46bb938-886b-49ca-9409-7260a48b26e8','2026-01-23 05:58:59','2026-01-23 05:58:59'),
('txn-de7ec0c9-d225-4254-b871-08dc7c56af04','tag-16e94775-cc47-45e4-b353-7b9a2846be80','2026-01-21 03:18:03','2026-01-21 03:18:03'),
('txn-de7ec0c9-d225-4254-b871-08dc7c56af04','tag-c46bb938-886b-49ca-9409-7260a48b26e8','2026-01-21 03:18:03','2026-01-21 03:18:03');

/*Table structure for table `fin_transactions` */

DROP TABLE IF EXISTS `fin_transactions`;

CREATE TABLE `fin_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `type` enum('PAYABLE','RECEIVABLE','TRANSFER','ADJUSTMENT') NOT NULL,
  `nf` varchar(64) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'BRL',
  `due_date` date NOT NULL,
  `paid_at` date DEFAULT NULL,
  `party_id` varchar(255) DEFAULT NULL,
  `cost_center` varchar(64) DEFAULT NULL,
  `category` varchar(64) DEFAULT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('pending','approved','scheduled','paid','overdue','canceled','provisioned') NOT NULL DEFAULT 'pending',
  `payment_method` enum('cash','pix','credit_card','debit_card','bank_transfer','boleto') DEFAULT NULL,
  `bank_account_id` varchar(64) DEFAULT NULL,
  `attachment_url` text DEFAULT NULL,
  `created_by_user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `store_id` varchar(255) DEFAULT NULL COMMENT 'Stores the id_code (UUID) of the store',
  `approved_by` varchar(255) DEFAULT NULL COMMENT 'Stores the id_code (UUID) of the user who approved',
  `updated_by_user_id` int(11) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `category_id` varchar(255) DEFAULT NULL,
  `cost_center_id` varchar(255) DEFAULT NULL,
  `recurrence_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `financial_transactions_status` (`status`),
  KEY `financial_transactions_due_date` (`due_date`),
  KEY `financial_transactions_type` (`type`),
  KEY `financial_transactions_created_by_user_id` (`created_by_user_id`),
  KEY `financial_transactions_store_id` (`store_id`),
  KEY `financial_transactions_approved_by` (`approved_by`),
  KEY `financial_transactions_updated_by_user_id_foreign_idx` (`updated_by_user_id`),
  KEY `financial_transactions_is_deleted` (`is_deleted`),
  KEY `fin_transactions_category_id` (`category_id`),
  KEY `fin_transactions_cost_center_id` (`cost_center_id`),
  KEY `fin_transactions_recurrence_id_foreign_idx` (`recurrence_id`),
  CONSTRAINT `fin_transactions_ibfk_1` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fin_transactions_recurrence_id_foreign_idx` FOREIGN KEY (`recurrence_id`) REFERENCES `fin_recurrences` (`id_code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `financial_transactions_updated_by_user_id_foreign_idx` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_transactions` */

insert  into `fin_transactions`(`id`,`id_code`,`type`,`nf`,`description`,`amount`,`currency`,`due_date`,`paid_at`,`party_id`,`cost_center`,`category`,`is_paid`,`status`,`payment_method`,`bank_account_id`,`attachment_url`,`created_by_user_id`,`created_at`,`updated_at`,`store_id`,`approved_by`,`updated_by_user_id`,`is_deleted`,`category_id`,`cost_center_id`,`recurrence_id`) values 
(40,'txn-be73d3b2-102b-4114-bf91-ca08b7ad490a','PAYABLE','11111','111',11111.00,'BRL','2026-01-18','2026-01-20','forn-001','Escritório','Vendas',1,'paid','pix','bk-74ce6c74-0580-45b7-885b-0104057ac727',NULL,10,'2026-01-18 05:20:21','2026-01-20 17:32:59','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,10,0,NULL,NULL,NULL),
(41,'txn-4191bf37-525c-44ec-a738-9b69abb21458','RECEIVABLE',NULL,'111',111.00,'BRL','2026-01-18',NULL,'cli-001','Escritório','Vendas',0,'canceled',NULL,NULL,'[{\"url\":\"http://localhost:4000/api/v1/files/1DXupPYc299UijFcFZyEC11dzpe994Wl8?filename=jam-1_1768714283660.jpg\",\"filename\":\"jam-1_1768714283660.jpg\"},{\"url\":\"http://localhost:4000/api/v1/files/1uiu91mvXYHrEdrQ6aN48RvDjo0N_9E_j?filename=jam-2_1768714283669.jpg\",\"filename\":\"jam-2_1768714283669.jpg\"},{\"url\":\"http://localhost:4000/api/v1/files/1lDlg_F10l88y9BAEByASu-o6mIvaSulv?filename=jam-3_1768714283650.jpg\",\"filename\":\"jam-3_1768714283650.jpg\"},{\"url\":\"http://localhost:4000/api/v1/files/1LrepGfUYxWY_cVqjf_nibH9GVizwGqJ1?filename=84c8369b-517a-4330-8ffb-a935de547712_1768716631481.jpg\",\"filename\":\"84c8369b-517a-4330-8ffb-a935de547712_1768716631481.jpg\"},{\"url\":\"http://localhost:4000/api/v1/files/1vj-cKuAXp2A_WyPRNyFdoKNwxErEMmB6?filename=33045572235810899000192000000000002525117832237698_1768716631498.pdf\",\"filename\":\"33045572235810899000192000000000002525117832237698_1768716631498.pdf\"},{\"url\":\"http://localhost:4000/api/v1/files/1OTs5-KDr-hP25hkPaCKSz69MFS7wLPfO?filename=33045572235810899000192000000000002625119365687553_1768716631463.pdf\",\"filename\":\"33045572235810899000192000000000002625119365687553_1768716631463.pdf\"},{\"url\":\"http://localhost:4000/api/v1/files/1reNtFWATB6NPdpGrDWHvbCbkifiWh7Iw?filename=33045572235810899000192000000000002726010527215677_1768716631515.pdf\",\"filename\":\"33045572235810899000192000000000002726010527215677_1768716631515.pdf\"}]',10,'2026-01-18 05:31:22','2026-01-18 06:12:07','e93becbc-8ea1-483d-84bf-2833cbf58785',NULL,10,0,NULL,NULL,NULL),
(42,'txn-5a3c8c31-67e9-4752-a400-a50a3280d940','RECEIVABLE',NULL,'222',2222.00,'BRL','2026-01-18','2026-01-18',NULL,'Manutenção','Serviços',1,'paid','pix','acc-bb','[{\"url\":\"http://localhost:4000/api/v1/files/1cdLAch2Ftb5IPyw8n0iUgvB8Mh-i5gko?filename=33045572235810899000192000000000002525117832237698_1768715507956.pdf\",\"filename\":\"33045572235810899000192000000000002525117832237698_1768715507956.pdf\"},{\"url\":\"http://localhost:4000/api/v1/files/1KScNd5yEE9D4Qy1Mw3IrQahFb2A2J1ct?filename=33045572235810899000192000000000002625119365687553_1768715507946.pdf\",\"filename\":\"33045572235810899000192000000000002625119365687553_1768715507946.pdf\"},{\"url\":\"http://localhost:4000/api/v1/files/1YTzNSKxNc0M9h-5ahFL7adQfMisZ0EGq?filename=33045572235810899000192000000000002726010527215677_1768715507952.pdf\",\"filename\":\"33045572235810899000192000000000002726010527215677_1768715507952.pdf\"}]',10,'2026-01-18 05:51:46','2026-01-18 22:30:08','e93becbc-8ea1-483d-84bf-2833cbf58785',NULL,10,0,NULL,NULL,NULL),
(43,'txn-8222b39e-c237-49fb-83b8-441e0fe9e3af','PAYABLE',NULL,'3333',3333.00,'BRL','2026-01-18',NULL,'forn-001','Escritório','Vendas',0,'pending',NULL,NULL,'[{\"url\":\"http://localhost:4000/api/v1/files/1u4V82xLVmOjUZAqJH5z1hzHMTTok2VZM?filename=image1_1768716502878.jpg\",\"filename\":\"image1_1768716502878.jpg\"},{\"url\":\"http://localhost:4000/api/v1/files/1J60TlsNt34niUuzFlSoKlD5N_Xv9r0cG?filename=jam-2_1768716502613.jpg\",\"filename\":\"jam-2_1768716502613.jpg\"},{\"url\":\"http://localhost:4000/api/v1/files/1CYskgGhMvufbEHCoXQEBoho8V_oXKAjE?filename=jam-3_1768716502891.jpg\",\"filename\":\"jam-3_1768716502891.jpg\"},{\"url\":\"http://localhost:4000/api/v1/files/1la0RdYdLEVDEyTNlU4eH1St06eLI_iJK?filename=33045572235810899000192000000000002726010527215677_1768716502900.pdf\",\"filename\":\"33045572235810899000192000000000002726010527215677_1768716502900.pdf\"}]',10,'2026-01-18 06:08:22','2026-01-18 06:12:31','e93becbc-8ea1-483d-84bf-2833cbf58785',NULL,10,1,NULL,NULL,NULL),
(44,'txn-78ca99d6-cb3b-4f90-9574-7ce461df4680','PAYABLE','0101','teste-lancamento',100.00,'BRL','2026-01-19','2026-01-19','forn-001','Escritório','Aluguel',1,'paid','pix','acc-bb','[{\"url\":\"https://beerclub-api.onrender.com/api/v1/files/1Lr2AsWXrl_cuDh0rJNDaZRFtCj-blOPQ?filename=DAS-PGMEI-35810899000192-AC2025%20(1)_1768847764419.pdf\",\"filename\":\"DAS-PGMEI-35810899000192-AC2025 (1)_1768847764419.pdf\"},{\"url\":\"https://beerclub-api.onrender.com/api/v1/files/1YWeOpcuOrx3AhRyWqW53jW5muSFeM3RT?filename=WhatsApp%20Image%202025-10-02%20at%2001.16.49_1768847764522.jpeg\",\"filename\":\"WhatsApp Image 2025-10-02 at 01.16.49_1768847764522.jpeg\"},{\"url\":\"https://beerclub-api.onrender.com/api/v1/files/1HVfIWyFT6dY0n8WoLms1hV2G90nAuDNs?filename=WhatsApp%20Image%202025-10-02%20at%2001.26.32_1768847764379.jpeg\",\"filename\":\"WhatsApp Image 2025-10-02 at 01.26.32_1768847764379.jpeg\"}]',10,'2026-01-19 18:36:02','2026-01-19 18:36:45','e93becbc-8ea1-483d-84bf-2833cbf58785',NULL,10,0,NULL,NULL,NULL),
(45,'txn-99cbced5-efd1-4321-8685-6e924eae7334','RECEIVABLE','33','323',333.00,'BRL','2026-01-20','2026-01-20','cli-001','Escritório','Serviços',1,'paid','pix','bk-74ce6c74-0580-45b7-885b-0104057ac727',NULL,10,'2026-01-20 03:50:18','2026-01-20 17:33:25','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,10,0,NULL,NULL,NULL),
(46,'txn-9e660658-1397-45eb-8e6e-e12faa32d977','RECEIVABLE',NULL,'ssss',2000.00,'BRL','2026-01-20','2026-01-20','cli-002','Escritório','Serviços',1,'paid','pix','bk-c4b4ea3b-e97b-4c89-b1dd-12c3165d0747',NULL,10,'2026-01-20 17:41:06','2026-01-20 17:41:06','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,NULL,NULL,NULL),
(47,'txn-d38e2c86-1781-4d37-8acc-7041e0f7d0bc','ADJUSTMENT',NULL,'Saldo Inicial',4000.00,'BRL','2026-01-20',NULL,NULL,NULL,NULL,1,'paid',NULL,'bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-20 17:54:19','2026-01-20 17:54:19','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,NULL,NULL,NULL),
(48,'txn-f0fc42e0-9183-4df4-b850-13bbe5f36b25','RECEIVABLE',NULL,'ggggg',100.00,'BRL','2026-01-22','2026-01-21','pty-2f69634e-0422-4ab9-841e-56bf6aa7b82f','Administrativo','despesa',1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-21 02:29:02','2026-01-21 22:59:53','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,10,0,NULL,NULL,NULL),
(49,'txn-ef90be34-07ad-4828-9679-c8961ee6f737','RECEIVABLE',NULL,'ggggg',100.00,'BRL','2026-01-22','2026-01-21','pty-2f69634e-0422-4ab9-841e-56bf6aa7b82f','Administrativo','despesa',1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-21 02:30:11','2026-01-21 23:00:29','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,10,0,'cat-05d2f649-569e-4c42-abba-332d8618122e','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(50,'txn-11702a18-9159-4e4c-82fd-99af719000da','RECEIVABLE',NULL,'ggggg',100.00,'BRL','2026-01-22','2026-01-21','pty-2f69634e-0422-4ab9-841e-56bf6aa7b82f','Administrativo','despesa',1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-21 02:38:03','2026-01-21 23:00:46','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,10,0,NULL,NULL,NULL),
(51,'txn-de7ec0c9-d225-4254-b871-08dc7c56af04','PAYABLE',NULL,'asadafsg',1000.00,'BRL','2026-01-21','2026-01-21','pty-5a25c143-3dbf-47f5-a835-77d6a47c26e2',NULL,NULL,1,'paid','pix','bk-c4b4ea3b-e97b-4c89-b1dd-12c3165d0747',NULL,10,'2026-01-21 03:18:02','2026-01-21 03:19:19','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,10,0,'cat-632f065b-39ee-4cff-9ab0-22a00c499819','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(55,'txn-510c85a6-bacc-43c5-9e53-8683975a6419','PAYABLE',NULL,'Light',100.00,'BRL','2026-01-01',NULL,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,0,'provisioned',NULL,NULL,NULL,10,'2026-01-21 09:30:24','2026-01-21 09:30:24','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-05d2f649-569e-4c42-abba-332d8618122e','cc-a095ac61-4af9-4ab9-baf4-9a3281fc8994','rec-76d403f5-ea4e-4d12-a23b-fedd0ff24561'),
(57,'txn-05179ffd-6678-421c-8faf-d2c826dbd783','PAYABLE',NULL,'tags',1000.00,'BRL','2026-01-22','2026-01-22','pty-2f69634e-0422-4ab9-841e-56bf6aa7b82f',NULL,NULL,1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-22 22:23:38','2026-01-22 22:23:38','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-632f065b-39ee-4cff-9ab0-22a00c499819','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(58,'txn-6104a690-5479-44ae-b595-9cb7c7eecc12','PAYABLE',NULL,'1',100.00,'BRL','2026-01-01','2026-01-02','pty-2f69634e-0422-4ab9-841e-56bf6aa7b82f',NULL,NULL,1,'paid','cash',NULL,NULL,10,'2026-01-23 03:13:50','2026-01-23 03:13:50','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-632f065b-39ee-4cff-9ab0-22a00c499819','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(59,'txn-393b9b2c-2c0e-4b77-9b53-f6fe09049623','PAYABLE',NULL,'2',140.00,'BRL','2026-01-02','2026-01-02','pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-23 03:14:57','2026-01-23 03:14:57','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(60,'txn-9a5ccc9d-8274-4ec5-9962-edb9014cb476','RECEIVABLE',NULL,'3',300.00,'BRL','2026-01-03','2026-01-04','pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-23 03:15:33','2026-01-23 03:15:33','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(61,'txn-4ef638af-fa14-4727-96ec-6752cd696fd6','PAYABLE',NULL,'4',234.00,'BRL','2026-01-04','2026-01-04','pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-23 03:16:16','2026-01-23 03:16:16','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-632f065b-39ee-4cff-9ab0-22a00c499819','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(62,'txn-8f49793d-9ba6-4da8-99f5-3daaec16eabb','PAYABLE',NULL,'5',543.00,'BRL','2026-01-23','2026-01-23','pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-23 03:17:47','2026-01-23 03:17:47','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(63,'txn-e0aaf942-334c-44cb-b2e5-6276cfa640d9','PAYABLE',NULL,'6',542.00,'BRL','2026-01-07','2026-01-07','pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-23 03:18:22','2026-01-23 03:18:22','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-632f065b-39ee-4cff-9ab0-22a00c499819','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(64,'txn-847e3499-723c-4332-87a4-74df5924aa39','PAYABLE',NULL,'jh',543.00,'BRL','2026-01-23','2026-01-23','pty-2f69634e-0422-4ab9-841e-56bf6aa7b82f',NULL,NULL,1,'paid','pix','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-23 03:18:52','2026-01-23 03:18:52','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(65,'txn-c9356284-ca07-4802-a415-4d4ebf5642e7','RECEIVABLE',NULL,'ksdfkdjf skldjf ksdjf lskdjf. s fsdf sdf skjdflgjdsflk gj. kgdjgkdjg dlf j jd gjdlf gjd gkje.  er tert ert ert er t rekt j lkjrel tkjerl jtl kjlj. erkl tjerljtj ',300.00,'BRL','2026-01-23','2026-01-23','pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,1,'paid','bank_transfer','bk-5ebeb316-f22f-4616-a4bb-15ea4998f0f0',NULL,10,'2026-01-23 05:58:59','2026-01-23 05:58:59','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-05d2f649-569e-4c42-abba-332d8618122e','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(66,'txn-aec3bc92-e262-4c87-828d-5a77018c9354','PAYABLE',NULL,' ad l dka kdk dk a dad ada. s ss ss ',2500.00,'BRL','2026-01-23','2026-01-23','pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,1,'paid','credit_card','bk-0de9dc44-5628-4082-965a-dede9363cf54',NULL,10,'2026-01-23 06:12:46','2026-01-23 06:12:46','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-05d2f649-569e-4c42-abba-332d8618122e','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8',NULL),
(67,'txn-34d1ce3f-4876-48ff-9cd5-8dab9601522e','PAYABLE',NULL,'aluguel',100.00,'BRL','2026-01-21',NULL,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,0,'provisioned',NULL,NULL,NULL,10,'2026-01-23 06:15:59','2026-01-23 06:15:59','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8','rec-67aa42a0-5608-4f83-a7de-dfeff31781ed'),
(68,'txn-92846895-4b55-4480-a1fe-0852ada7a5cf','RECEIVABLE',NULL,'sdddd',1000.00,'BRL','2026-01-23',NULL,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,0,'canceled',NULL,NULL,NULL,10,'2026-01-23 06:16:00','2026-02-10 04:34:53','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,10,0,'cat-05d2f649-569e-4c42-abba-332d8618122e','cc-a095ac61-4af9-4ab9-baf4-9a3281fc8994','rec-aa65628a-e54a-4953-9190-9db01038473e'),
(69,'txn-d0486119-07fd-4430-947f-6f90c4e8724d','PAYABLE',NULL,'aluguel',100.00,'BRL','2026-02-05',NULL,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,0,'provisioned',NULL,NULL,NULL,10,'2026-02-26 03:05:00','2026-02-26 03:05:00','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-26b85c1e-dc00-45be-aecd-c45dd843f0fe','cc-9b0ba652-ab4b-45f6-a11d-19a4466558b8','rec-67aa42a0-5608-4f83-a7de-dfeff31781ed'),
(70,'txn-8b0b666f-2ca9-426d-b8d2-57f7396f35dc','PAYABLE',NULL,'Light',100.00,'BRL','2026-02-05',NULL,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,0,'provisioned',NULL,NULL,NULL,10,'2026-02-26 03:05:00','2026-02-26 03:05:00','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-05d2f649-569e-4c42-abba-332d8618122e','cc-a095ac61-4af9-4ab9-baf4-9a3281fc8994','rec-76d403f5-ea4e-4d12-a23b-fedd0ff24561'),
(71,'txn-3e8faf75-18d1-41fd-acd2-c30f9481a785','RECEIVABLE',NULL,'sdddd',1000.00,'BRL','2026-02-05',NULL,'pty-8388878e-5869-4d1a-be04-1d43e6dadde6',NULL,NULL,0,'provisioned',NULL,NULL,NULL,10,'2026-02-26 03:05:00','2026-02-26 03:05:00','d1b685fd-d18a-4ee6-aa07-293bb66117f3',NULL,NULL,0,'cat-05d2f649-569e-4c42-abba-332d8618122e','cc-a095ac61-4af9-4ab9-baf4-9a3281fc8994','rec-aa65628a-e54a-4953-9190-9db01038473e');

/*Table structure for table `fin_vendors` */

DROP TABLE IF EXISTS `fin_vendors`;

CREATE TABLE `fin_vendors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` char(36) NOT NULL DEFAULT uuid(),
  `store_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `document` varchar(32) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `bank_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bank_info`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  KEY `idx_fin_vendors_store_id` (`store_id`),
  KEY `idx_fin_vendors_document` (`document`),
  KEY `idx_fin_vendors_id_code` (`id_code`),
  CONSTRAINT `fin_vendors_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `fin_vendors` */

/*Table structure for table `football_teams` */

DROP TABLE IF EXISTS `football_teams`;

CREATE TABLE `football_teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `short_name` varchar(50) NOT NULL,
  `abbreviation` char(3) NOT NULL,
  `shield` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `football_teams` */

insert  into `football_teams`(`id`,`name`,`short_name`,`abbreviation`,`shield`) values 
(1,'Sociedade Esportiva Palmeiras','Palmeiras','PAL','https://s.sde.globo.com/media/organizations/2019/07/06/Palmeiras.svg'),
(2,'CR Flamengo','Flamengo','FLA','https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg'),
(3,'Cruzeiro Esporte Clube','Cruzeiro','CRU','https://s.sde.globo.com/media/organizations/2021/02/13/cruzeiro_2021.svg'),
(4,'Mirassol Futebol Clube','Mirassol','MIR','https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg'),
(5,'Esporte Clube Bahia','Bahia','BAH','https://s.sde.globo.com/media/organizations/2018/03/11/bahia.svg'),
(6,'Botafogo de Futebol e Regatas','Botafogo','BOT','https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg'),
(7,'Fluminense Football Club','Fluminense','FLU','https://s.sde.globo.com/media/organizations/2018/03/11/fluminense.svg'),
(8,'Clube de Regatas Vasco da Gama','Vasco','VAS','https://s.sde.globo.com/media/organizations/2021/09/04/vasco_SVG.svg'),
(9,'São Paulo Futebol Clube','São Paulo','SAO','https://s.sde.globo.com/media/organizations/2018/03/11/sao-paulo.svg'),
(10,'Red Bull Bragantino','Bragantino','RBB','https://s.sde.globo.com/media/organizations/2021/06/28/bragantino.svg'),
(11,'Sport Club Corinthians Paulista','Corinthians','COR','https://s.sde.globo.com/media/organizations/2024/10/09/Corinthians_2024_Q4ahot4.svg'),
(12,'Grêmio Foot-Ball Porto Alegrense','Grêmio','GRE','https://s.sde.globo.com/media/organizations/2018/03/12/gremio.svg'),
(13,'Ceará Sporting Club','Ceará','CEA','https://s.sde.globo.com/media/organizations/2019/10/10/ceara.svg'),
(14,'Sport Club Internacional','Internacional','INT','https://s.sde.globo.com/media/organizations/2018/03/11/internacional.svg'),
(15,'Clube Atlético Mineiro','Atlético-MG','CAM','https://s.sde.globo.com/media/organizations/2018/03/10/atletico-mg.svg'),
(16,'Santos FC','Santos','SAN','https://s.sde.globo.com/media/organizations/2018/03/12/santos.svg'),
(17,'Esporte Clube Vitória','Vitória','VIT','https://s.sde.globo.com/media/organizations/2024/04/09/escudo-vitoria-svg-69281.svg'),
(18,'Esporte Clube Juventude','Juventude','JUV','https://s.sde.globo.com/media/organizations/2021/04/29/Juventude-2021-01.svg'),
(19,'Fortaleza Esporte Clube','Fortaleza','FOR','https://s.sde.globo.com/media/organizations/2021/09/19/Fortaleza_2021_1.svg'),
(20,'Sport Club do Recife','Sport','SPT','https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg'),
(21,'América Futebol Clube','América-MG','AME','https://s.sde.globo.com/media/organizations/2024/05/07/America-MG-branco.svg'),
(22,'Amazonas Futebol Clube','Amazonas','AMA','https://s.sde.globo.com/media/organizations/2024/08/20/Amazonas_2024.svg'),
(23,'Associação Atlética Ponte Preta','Ponte Preta','PON','https://s.sde.globo.com/media/organizations/2019/03/17/ponte-preta.svg'),
(24,'Associação Chapecoense de Futebol','Chapecoense','CHA','https://s.sde.globo.com/media/organizations/2021/06/21/CHAPECOENSE-2018.svg'),
(25,'Associação Ferroviária de Esportes','Ferroviária','AFE','https://s.sde.globo.com/media/organizations/2019/01/08/Ferroviaria_Araraquara.svg'),
(26,'Athletic Club','Athletic Club','ATH','https://s.sde.globo.com/media/organizations/2025/01/22/Athletic_Club-mineiro.svg'),
(27,'Athletico Paranaense','Athletico-PR','CAP','https://s.sde.globo.com/media/organizations/2019/09/09/Athletico-PR.svg'),
(28,'Atlético Goianiense','Atlético-GO','ACG','https://s.sde.globo.com/media/organizations/2020/07/02/atletico-go-2020.svg'),
(29,'Avaí Futebol Clube','Avaí','AVA','https://s.sde.globo.com/media/organizations/2024/05/12/avaí.svg'),
(30,'Botafogo Futebol Clube','Botafogo-SP','BSP','https://s.sde.globo.com/media/organizations/2024/05/15/BFC.svg'),
(31,'Clube de Regatas Brasil','CRB','CRB','https://s.sde.globo.com/media/organizations/2018/03/11/crb.svg'),
(33,'Coritiba Foot Ball Club','Coritiba','CFC','https://s.sde.globo.com/media/organizations/2018/03/11/coritiba.svg'),
(34,'Criciúma Esporte Clube','Criciúma','CRI','https://s.sde.globo.com/media/organizations/2024/03/28/Criciuma-2024.svg'),
(35,'Cuiabá Esporte Clube','Cuiabá','CUI','https://s.sde.globo.com/media/organizations/2018/12/26/Cuiaba_EC.svg'),
(36,'Goiás Esporte Clube','Goiás','GOI','https://s.sde.globo.com/media/organizations/2021/03/01/GOIAS-2021.svg'),
(38,'Novorizontino','Novorizontino','NOV','https://s.sde.globo.com/media/organizations/2019/01/08/Novohorizontino.svg'),
(39,'Operário Ferroviário Esporte Clube','Operário-PR','OPE','https://s.sde.globo.com/media/organizations/2018/12/27/Operário-PR.svg'),
(40,'Paysandu Sport Club','Paysandu','PAY','https://s.sde.globo.com/media/organizations/2019/05/29/Paysandu.svg'),
(41,'Clube do Remo','Remo','REM','https://s.sde.globo.com/media/organizations/2021/02/25/Remo-PA.svg'),
(42,'Vila Nova Futebol Clube','Vila Nova','VNO','https://s.sde.globo.com/media/organizations/2021/04/07/vilanova.svg'),
(43,'Volta Redonda Futebol Clube','Volta Redonda','VRE','https://s.sde.globo.com/media/organizations/2021/04/27/Volta-Redonda-2020.svg');

/*Table structure for table `messages` */

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  KEY `from_user_id` (`from_user_id`),
  KEY `to_user_id` (`to_user_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `messages` */

/*Table structure for table `order_items` */

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `original_price` decimal(10,2) NOT NULL,
  `paid_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `order_items` */

insert  into `order_items`(`id`,`order_id`,`product_id`,`quantity`,`original_price`,`paid_price`,`created_at`) values 
(1,1,1,2,25.00,22.50,'2025-08-05 18:00:00'),
(2,1,3,1,50.00,45.00,'2025-08-05 18:00:00'),
(3,2,2,1,50.00,50.00,'2025-08-06 19:00:00'),
(4,3,4,3,10.00,10.00,'2025-08-07 20:00:00'),
(5,3,5,1,0.00,0.00,'2025-08-07 20:00:00'),
(6,4,1,4,25.00,22.50,'2025-08-08 21:00:00'),
(7,5,3,2,20.00,20.00,'2025-08-09 22:00:00');

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `waiter_id` int(11) DEFAULT NULL,
  `total_original_price` decimal(10,2) NOT NULL,
  `total_paid_price` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `store_id` (`store_id`),
  KEY `waiter_id` (`waiter_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`waiter_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `orders` */

insert  into `orders`(`id`,`user_id`,`store_id`,`waiter_id`,`total_original_price`,`total_paid_price`,`status`,`created_at`) values 
(1,7,1,5,100.00,90.00,'paid','2025-08-05 18:00:00'),
(2,8,2,6,50.00,50.00,'paid','2025-08-06 19:00:00'),
(3,10,3,NULL,30.00,30.00,'paid','2025-08-07 20:00:00'),
(4,11,1,5,200.00,180.00,'paid','2025-08-08 21:00:00'),
(5,7,3,NULL,40.00,40.00,'pending','2025-08-09 22:00:00');

/*Table structure for table `pix_payments` */

DROP TABLE IF EXISTS `pix_payments`;

CREATE TABLE `pix_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `external_id` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('created','pending','paid','failed') DEFAULT 'pending',
  `payload` text DEFAULT NULL,
  `received_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `pix_payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pix_payments` */

/*Table structure for table `plans` */

DROP TABLE IF EXISTS `plans`;

CREATE TABLE `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `plans` */

insert  into `plans`(`id`,`name`,`description`,`price`,`created_at`) values 
(1,'Bronze','Plano básico com desconto de 5%',29.90,'2025-08-02 02:09:56'),
(2,'Prata','Plano premium com desconto de 10%',49.90,'2025-08-02 02:09:56'),
(3,'Ouro','Plano gold com desconto de 15%',79.90,'2025-08-02 02:09:56');

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `normal_price` decimal(10,2) NOT NULL,
  `price_plan_1` decimal(10,2) DEFAULT NULL,
  `price_plan_2` decimal(10,2) DEFAULT NULL,
  `price_plan_3` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`store_id`,`name`,`description`,`image_url`,`normal_price`,`price_plan_1`,`price_plan_2`,`price_plan_3`,`stock`,`created_at`) values 
(1,1,'Chopp Brahma','Chopp Brahma 300ml','https://example.com/chopp-brahma.jpg',8.00,7.60,7.20,6.80,50,'2025-08-02 02:09:57'),
(2,1,'Chopp Heineken','Chopp Heineken 300ml','https://example.com/chopp-heineken.jpg',12.00,11.40,10.80,10.20,30,'2025-08-02 02:09:57'),
(3,1,'Porção de Fritas','Porção de batatas fritas','https://example.com/fritas.jpg',22.00,20.90,19.80,18.70,20,'2025-08-02 02:09:57'),
(4,1,'Porção de Calabresa','Porção de calabresa acebolada','https://example.com/calabresa.jpg',28.00,26.60,25.20,23.80,15,'2025-08-02 02:09:57'),
(5,2,'IPA Artesanal','India Pale Ale artesanal','https://example.com/ipa.jpg',18.00,17.10,16.20,15.30,25,'2025-08-02 02:09:57'),
(6,2,'Stout Artesanal','Stout artesanal','https://example.com/stout.jpg',20.00,19.00,18.00,17.00,20,'2025-08-02 02:09:57'),
(7,2,'Pilsen Artesanal','Pilsen artesanal','https://example.com/pilsen.jpg',16.00,15.20,14.40,13.60,30,'2025-08-02 02:09:57'),
(8,2,'Combo Petisco','Combo com porção + cerveja','https://example.com/combo.jpg',35.00,33.25,31.50,29.75,10,'2025-08-02 02:09:57'),
(9,3,'Guinness','Guinness 500ml','https://example.com/guinness.jpg',25.00,23.75,22.50,21.25,20,'2025-08-02 02:09:57'),
(10,3,'Whisky Jameson','Jameson Irish Whisky','https://example.com/jameson.jpg',35.00,33.25,31.50,29.75,15,'2025-08-02 02:09:57'),
(11,3,'Fish & Chips','Fish & Chips tradicional','https://example.com/fish-chips.jpg',45.00,42.75,40.50,38.25,8,'2025-08-02 02:09:57'),
(12,3,'Shepherd\'s Pie','Shepherd\'s Pie caseiro','https://example.com/shepherds-pie.jpg',38.00,36.10,34.20,32.30,12,'2025-08-02 02:09:57');

/*Table structure for table `store_schedules` */

DROP TABLE IF EXISTS `store_schedules`;

CREATE TABLE `store_schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL,
  `day_of_week` int(11) NOT NULL COMMENT '0: Domingo, 1: Segunda, ..., 6: Sábado',
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `is_open` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_schedules_unique_store_day` (`store_id`,`day_of_week`),
  CONSTRAINT `store_schedules_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `store_schedules` */

insert  into `store_schedules`(`id`,`store_id`,`day_of_week`,`opening_time`,`closing_time`,`is_open`,`created_at`,`updated_at`) values 
(1,7,0,'11:00:00','18:00:00',1,'2025-11-01 03:59:39','2025-11-01 04:14:32'),
(2,7,1,NULL,NULL,0,'2025-11-01 03:59:39','2025-11-01 03:59:39'),
(3,7,2,NULL,NULL,0,'2025-11-01 03:59:39','2025-11-01 03:59:39'),
(4,7,3,NULL,NULL,0,'2025-11-01 03:59:39','2025-11-01 03:59:39'),
(5,7,4,NULL,NULL,0,'2025-11-01 03:59:39','2025-11-01 03:59:39'),
(6,7,5,NULL,NULL,0,'2025-11-01 03:59:39','2025-11-01 03:59:39'),
(7,7,6,NULL,NULL,0,'2025-11-01 03:59:39','2025-11-01 03:59:39'),
(8,8,0,NULL,NULL,0,'2025-11-03 20:03:19','2025-11-03 20:03:19'),
(9,8,1,NULL,NULL,0,'2025-11-03 20:03:19','2025-11-03 20:03:19'),
(10,8,2,NULL,NULL,0,'2025-11-03 20:03:19','2025-11-03 20:03:19'),
(11,8,3,NULL,NULL,0,'2025-11-03 20:03:19','2025-11-03 20:03:19'),
(12,8,4,NULL,NULL,0,'2025-11-03 20:03:19','2025-11-03 20:03:19'),
(13,8,5,NULL,NULL,0,'2025-11-03 20:03:19','2025-11-03 20:03:19'),
(14,8,6,NULL,NULL,0,'2025-11-03 20:03:19','2025-11-03 20:03:19');

/*Table structure for table `store_users` */

DROP TABLE IF EXISTS `store_users`;

CREATE TABLE `store_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `role` enum('admin','manager','waiter') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `store_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `store_users_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `store_users` */

insert  into `store_users`(`id`,`user_id`,`store_id`,`role`,`created_at`) values 
(1,2,1,'admin','2025-08-02 02:09:57'),
(2,3,2,'admin','2025-08-02 02:09:57'),
(3,4,3,'admin','2025-08-02 02:09:57'),
(4,5,1,'waiter','2025-08-02 02:09:57'),
(5,6,2,'waiter','2025-08-02 02:09:57');

/*Table structure for table `stores` */

DROP TABLE IF EXISTS `stores`;

CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `instagram_handle` varchar(100) DEFAULT NULL,
  `facebook_handle` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `owner_id` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `type` enum('bar','restaurante','pub','cervejaria','casa noturna') DEFAULT NULL,
  `legal_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `address_street` varchar(255) DEFAULT NULL,
  `address_neighborhood` varchar(255) DEFAULT NULL,
  `address_state` varchar(2) DEFAULT NULL,
  `address_number` varchar(20) DEFAULT NULL,
  `address_complement` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `id_code` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `id_code_2` (`id_code`),
  KEY `stores_owner_id_foreign_idx` (`owner_id`),
  CONSTRAINT `stores_owner_id_foreign_idx` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `stores` */

insert  into `stores`(`id`,`name`,`email`,`cnpj`,`logo_url`,`instagram_handle`,`facebook_handle`,`created_at`,`owner_id`,`capacity`,`type`,`legal_name`,`phone`,`zip_code`,`address_street`,`address_neighborhood`,`address_state`,`address_number`,`address_complement`,`banner_url`,`website`,`latitude`,`longitude`,`id_code`,`description`) values 
(1,'Bar do França','franca@bardofranca.com.br','12.345.678/0001-90','http://localhost:3001/images/stores/store-1762287023223.png','@francabar','bardofranca','2025-08-02 02:09:56',20,50,'bar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'52d04ea7-7ee9-4460-b268-ca30c84d0920',NULL),
(2,'Cervejaria Artesanal','maria@cervejaria.com','98.765.432/0001-10',NULL,'@cervejariaartesanal','cervejariaartesanal','2025-08-02 02:09:56',1,50,'bar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'d947b69b-cc77-44f1-a106-3ab6384258a2',NULL),
(3,'Pub Irlandês','davisvasconcellos@gmail.com','11.222.333/0001-44',NULL,'bardozecg','pubirlandes','2025-08-02 02:09:56',1,30,'bar',NULL,'21965445992','22271-020','Rua Conde de Irajá','Botafogo','RJ','532',NULL,NULL,'www.site.com',NULL,NULL,'d1b685fd-d18a-4ee6-aa07-293bb66117f3','desc'),
(4,'Bar do França - Cerveja Artesanal','franca@bardofranca.com.br','12345678000199','http://localhost:3001/images/stores/franca-bar.png','@francabar','bardofranca','2025-11-01 02:18:13',20,30,'bar','José da Silva Bar e Petiscos ME','11987654321','01001-000','Avenida Principal','Centro','SP','1500','Térreo','https://exemplo.com/banner.jpg','https://bardozeteste.com',-23.56130000,-46.65650000,'6805ce19-76e5-4aba-9222-235471b3c371',NULL),
(5,'Bar do Zé - Cerveja Gelada','contato@bardozeteste.com','123456780001993',NULL,'bardozecg','bardozecgoficial','2025-11-01 02:25:46',1,120,'bar','José da Silva Bar e Petiscos ME','11987654321','01001-000','Avenida Principal','Centro','SP','1500','Térreo','https://exemplo.com/banner.jpg','https://bardozeteste.com',-23.56130000,-46.65650000,'7766da94-468b-46a7-b4a8-eaf8e7312228',NULL),
(7,'Loja teste - 5- atualizada','contato@bardozeteste.com','123456780001333',NULL,'bardozecg','bardozecgoficial','2025-11-01 03:59:39',9,120,'bar','José da Silva Bar e Petiscos ME','11987654321','01001-000','Avenida Principal','Centro','SP','1500','Térreo','https://exemplo.com/banner.jpg','https://bardozeteste.com',-23.56130000,-46.65650000,'90a7b2e7-d305-4ddc-8b88-2dc0d31da42c',NULL),
(8,'Cervejeiros','contato@bardozeteste.com','123456780001336','http://localhost:3001/images/stores/store-1762299726431.jpg','bardozecg','bardozecgoficial','2025-11-03 20:03:19',20,120,'bar','José da Silva Bar e Petiscos ME','11987654321','21911400','Rua Magno Martins','Freguesia (Ilha do Governador)','RJ','22','loja a','https://exemplo.com/banner.jpg','https://bardozeteste.com',-22.79001920,-43.17252120,'e93becbc-8ea1-483d-84bf-2833cbf58785','');

/*Table structure for table `sys_modules` */

DROP TABLE IF EXISTS `sys_modules`;

CREATE TABLE `sys_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL COMMENT 'Identificador único para uso no código (ex: financial, events, pub)',
  `description` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `id_code_2` (`id_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `sys_modules` */

insert  into `sys_modules`(`id`,`id_code`,`name`,`slug`,`description`,`active`,`created_at`,`updated_at`) values 
(1,'cce6d504-7b6a-4a11-b3e8-049eebe3f10c','Financeiro','financial','Gestão de Contas e Transações',1,'2026-01-24 00:04:28','2026-01-24 00:04:28'),
(2,'27bddbc0-1b92-40e3-986a-e49bfcfc8402','Eventos','events','Gestão de Eventos e Participantes',1,'2026-01-24 00:04:28','2026-01-24 00:04:28'),
(3,'2a2dc2ec-ddd9-4291-b00a-1b8abae7d867','Pub','pub','Gestão de Comandas e Pedidos',1,'2026-01-24 00:04:28','2026-01-24 00:04:28');

/*Table structure for table `sys_user_modules` */

DROP TABLE IF EXISTS `sys_user_modules`;

CREATE TABLE `sys_user_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_module` (`user_id`,`module_id`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `sys_user_modules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_user_modules_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `sys_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `sys_user_modules` */

insert  into `sys_user_modules`(`id`,`user_id`,`module_id`,`created_at`,`updated_at`) values 
(2,20,3,'2026-01-24 21:42:12','2026-01-24 21:42:12'),
(6,19,3,'2026-01-24 21:54:14','2026-01-24 21:54:14'),
(8,30,1,'2026-01-24 22:05:38','2026-01-24 22:05:38'),
(10,30,2,'2026-01-24 22:24:20','2026-01-24 22:24:20'),
(11,30,3,'2026-01-24 22:24:21','2026-01-24 22:24:21'),
(19,22,1,'2026-01-27 00:27:56','2026-01-27 00:27:56'),
(20,22,2,'2026-01-27 02:22:19','2026-01-27 02:22:19'),
(21,22,3,'2026-01-27 02:22:20','2026-01-27 02:22:20'),
(22,27,2,'2026-02-25 01:34:49','2026-02-25 01:34:49');

/*Table structure for table `token_blacklist` */

DROP TABLE IF EXISTS `token_blacklist`;

CREATE TABLE `token_blacklist` (
  `token` varchar(500) NOT NULL,
  `expiresAt` datetime NOT NULL,
  PRIMARY KEY (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `token_blacklist` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','manager','waiter','customer','master') DEFAULT 'customer',
  `team_user` int(20) DEFAULT NULL,
  `plan_id` int(11) DEFAULT 1,
  `plan_start` date DEFAULT NULL,
  `plan_end` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `google_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address_street` varchar(255) DEFAULT NULL,
  `address_number` varchar(20) DEFAULT NULL,
  `address_complement` varchar(255) DEFAULT NULL,
  `address_neighborhood` varchar(255) DEFAULT NULL,
  `address_city` varchar(255) DEFAULT NULL,
  `address_state` varchar(2) DEFAULT NULL,
  `address_zip_code` varchar(10) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','inactive','pending_verification','banned') NOT NULL DEFAULT 'active',
  `google_uid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_code` (`id_code`),
  UNIQUE KEY `id_code_2` (`id_code`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `google_uid` (`google_uid`),
  KEY `plan_id` (`plan_id`),
  KEY `team_user` (`team_user`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`team_user`) REFERENCES `football_teams` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`id_code`,`name`,`email`,`phone`,`password_hash`,`role`,`team_user`,`plan_id`,`plan_start`,`plan_end`,`created_at`,`google_id`,`avatar_url`,`birth_date`,`address_street`,`address_number`,`address_complement`,`address_neighborhood`,`address_city`,`address_state`,`address_zip_code`,`email_verified`,`status`,`google_uid`) values 
(1,'17546931531','Admin Master','admin@example.com','(11) 99999-9999','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','admin',26,3,'2024-01-01','2024-12-31','2025-08-02 02:09:57',NULL,'http://localhost:3001/images/user/user-1761688542828-721.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(2,'17546931532','João Update1','manager@example.com','999999999999','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','manager',1,2,'2024-01-01','2024-12-31','2025-08-02 02:09:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(3,'17546931533','Maria Santos','user@example.com','(11) 77777-7777','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','customer',1,2,'2024-01-01','2024-12-31','2025-08-02 02:09:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(4,'17546931094','Pedro O\'Connor','pedro@pubirlandes.com','(11) 66666-6666','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','manager',2,1,'2024-01-01','2024-12-31','2025-08-02 02:09:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(5,'17546931535','Garçom do bar','waiter@example.com','11555555555','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','waiter',29,1,NULL,NULL,'2025-08-02 02:09:57',NULL,'http://localhost:3001/images/user/user-1762408479258.jpeg','2007-10-09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(6,'17546931536','Garçom 2','garcom2@cervejaria.com','(11) 44444-4444','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','waiter',8,1,NULL,NULL,'2025-08-02 02:09:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(7,'17546931537','Cliente 1','cliente1@meufood.com','(11) 33333-3333','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','customer',1,2,'2024-01-01','2024-12-31','2025-08-02 02:09:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(8,'17546931538','Cliente 2','cliente2@email.com','(11) 22222-2222','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','customer',3,2,'2024-01-01','2024-12-31','2025-08-02 02:09:57',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(9,'17546931539','Master Jedi','master@example.com','22222222222','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','master',26,1,NULL,NULL,'2025-08-06 22:54:53',NULL,'http://localhost:3001/images/user/user-avatar-17546931539-1762219317173-54.jpeg','2007-05-15','Rua Magno Martins','209','202','Freguesia (Ilha do Governador)','Rio de Janeiro','RJ','21911430',0,'active',NULL),
(10,'175469315310','DAVIS PEREIRA DE VASCONCELLOS','davisvasconcellos@gmail.com','21965445992','$2a$12$RIrrKcv.JwmKeDWYg50IIuG3VLeLJiPDjPfwh96s2IleK6FTpiUbW','master',8,2,NULL,NULL,'2025-08-07 23:20:37','G4w57a1zNNW2oMOZAYaY6R7Pgd53','https://lh3.googleusercontent.com/a/ACg8ocIHgOHW4bZn1P9xhjo_f-36rr7jSRWP90UuKJRqi2_jdH7au21F=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','G4w57a1zNNW2oMOZAYaY6R7Pgd53'),
(11,'175469315311','Cliente 2','cliente2@meufood.com','216546321654','$2a$12$YDSmhZuBfypNZ6PVPSmaweG5XSix9WeR04wcYyEJ.r05Xk1rgCy.m','customer',4,1,NULL,NULL,'2025-08-08 21:42:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(12,'175469315312','Gerente do Bar','gerente@meufood.com','216546321654','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','manager',8,1,NULL,NULL,'2025-08-19 23:09:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(13,'175469315313','Dono do Bar','dono@meufood.com','216546321654','$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','admin',4,1,NULL,NULL,'2025-08-19 23:11:14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(14,'1761429986391_14','user1','user1@example.com','11911111111','$2a$12$5Dq1ekjlRnMpq0AjESfYJuRzKhrtXtjymLDCXeuuYCXq/tDtBYbdG','customer',5,1,NULL,NULL,'2025-10-25 22:06:25',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(15,'1761430856029_15','user2','user2@example.com','11911111111','$2a$12$wDt4EdLBf2wTqBXbKwgfcODo.LMF6R.QzCEJI3OL641IMaJJ7IEQO','customer',3,1,NULL,NULL,'2025-10-25 22:20:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(16,'176143793606616','user3 update','user3@example.com','11987654321','$2a$12$aMchLGKNYq7q4rHMMnhbheQ6dnzuvFAOGexnGuVgaNqlyHuCMEpn2','manager',5,2,NULL,NULL,'2025-10-26 00:18:55',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(17,'176157899694717','user4 user4','user4@example.com',NULL,'$2a$12$z7o1B/GzEKYgkd4sMU28z..adOitPgOahitTauJHTo5yWbhZrZSR6','customer',6,1,NULL,NULL,'2025-10-27 15:29:55',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(18,'176157962661518','user5 user5','user5@example.com',NULL,'$2a$12$JmbtrsOP48/qOIw0B7Mpi.SYC0DLn.We8irtBglPvoYg0SsuTXfQ2','customer',8,1,NULL,NULL,'2025-10-27 15:40:26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(19,'176158215528419','home5 home5','home5@example.com',NULL,'$2a$12$G5GFJ/J2tCnnW4bik5t8bOMI0Y/OEqcRzAYpxsxp3LBEbQhfzSTci','customer',8,1,NULL,NULL,'2025-10-27 16:22:34',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(20,'176201116447120','Thiago França','franca@bardofranca.com.br',NULL,'$2a$12$dKg5CDMeM/Q/p7TRWVyqU.l6f/NmYkgYaTf98SFZTh0geGpwhzdk6','admin',6,1,NULL,NULL,'2025-11-01 15:32:43',NULL,'http://localhost:3001/images/user/user-1763089555415.webp',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(22,'52c54731-4c70-4729-a26e-29f2d70e1d84','digital media','dmediapixel@gmail.com','21222222222','$2a$12$vQH4afs15dvavw3hOJRqBeSbCYUlb.UtIhMtAOQfRFbkDDp/THTgK','customer',8,1,NULL,NULL,'2025-11-06 03:39:46','EY9dyrnfn7c6FImwzLcatCWoFoB2','https://lh3.googleusercontent.com/a/ACg8ocL-ziENoK93sbBfiBOlaqHxCi_wRETFI-UzxnJGvfkINoGncCg=s96-c','2007-11-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','EY9dyrnfn7c6FImwzLcatCWoFoB2'),
(23,'e565a899-4d4d-40ac-a07d-b204a6536046','seiro saffa','seirosaffawou-1239@yopmail.com',NULL,'$2a$12$sjv8B.1DER20qeg0xk0l3e9939l8Cj1cKW1OIf0W/LeRWHCaTYK.W','customer',NULL,1,NULL,NULL,'2025-11-13 19:58:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(24,'ad93bb3b-ff88-492b-aafc-8a160676b504','Verif User','verif-20251114@example.com','21999999999','$2a$12$J3mFLSXMm/4dXeZf6hRMpO0iOHUKNlVQOLCHtuxfidXQvLSGD7YX.','customer',NULL,1,NULL,NULL,'2025-11-14 06:39:44',NULL,'https://example.com/avatar-new.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(25,'0fee653b-8ad8-443c-b74d-4da393893c6c','Jorge Fontes','fontesjorge89@gmail.com',NULL,'$2a$12$b5pBp9tt1mf1TRFcCWcYkeaD0KdOV/a1JYB3xFoXhsaGZP0Fp69tu','customer',6,1,NULL,NULL,'2025-11-18 02:33:05','YyQm0x1ivpNWC37rDgspMXt8VuE3','https://lh3.googleusercontent.com/a/ACg8ocJbP2E7gfbYsrdazx-xquiNb2bYVTwrNL64YsDjm3JDslMz3Cw=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','YyQm0x1ivpNWC37rDgspMXt8VuE3'),
(26,'8948104d-d841-4e61-9121-67107e979990','Suporte GSuiteCloud','suporte@gsuitecloud.com',NULL,'$2a$12$uNY5hgguptb7ZXC2Cm8ilu/0lgn0jA7XfhOQ2z5sFRgwLwNYCLUG2','customer',NULL,1,NULL,NULL,'2025-11-28 00:43:07','pgCQSiM3dHSEzsNCILbKyqOSWpa2','https://lh3.googleusercontent.com/a/ACg8ocL2f55qE0Gai-qaqEPQQpSZXz_OiFaJ_49f2YN-kDhWfsQ6Sg=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','pgCQSiM3dHSEzsNCILbKyqOSWpa2'),
(27,'177160fd-609f-4d28-af72-33a46cdc01d8','Erick MARQUEZ','emarquez.eng@gmail.com',NULL,'$2a$12$Wi3d7ST4TClJd88SqT84L.WwkEG6YIkSvbCa4K3ADyZZfnOYYB/P6','admin',NULL,1,NULL,NULL,'2025-11-29 03:35:52','sG3BDdFDXhNXlsdSXGE0goAGwiQ2','https://lh3.googleusercontent.com/a/ACg8ocJpkOJQGk6RPeGFZdhx8tAk0a5hX7qFPaTXzITkxv6JYltdZA5d=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','sG3BDdFDXhNXlsdSXGE0goAGwiQ2'),
(28,'afe360c7-4b9e-481b-aeb7-ca91c8e3a06b','Erick Marquez','emarquezeng@gmail.com',NULL,'$2a$12$gLkG1vSvRsCEYR4VKKQ/JOvSM.8t5mEmNPOvkKWSQycBrWJxbbjPa','customer',NULL,1,NULL,NULL,'2025-11-29 03:39:37',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(29,'ed9e5ce7-5fa5-4341-b90d-05c8c33dec9b','Beatmaq music beats','beatmaqmusic@gmail.com',NULL,'$2a$12$CK169ahBBWkNMZmc4m09/OZi4XJF1KO6q8HTXgo17/BQpg9nmwigm','customer',NULL,1,NULL,NULL,'2025-11-30 05:40:31','rJOk1aOqDrPaGQ3NnXa3VxerR883','https://lh3.googleusercontent.com/a/ACg8ocKUH4RNnSMPlEwX-LcbaicTZ5AE45X_leTs5A8Z6b19lVrJew4=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','rJOk1aOqDrPaGQ3NnXa3VxerR883'),
(30,'1c333e9b-daa6-448b-ad3b-dded4dd230d9','Wendell Lavor','wendellfranck@gmail.com',NULL,'$2a$12$D8O7Xhca7Hhh9o42XpMikOzNcn/iLjLRCggT/vF.Ec6lPiYTYpQv6','customer',NULL,1,NULL,NULL,'2025-12-10 02:30:51','8vpHUU3Aa5OeoiOgEFUAehrTEbF2','https://lh3.googleusercontent.com/a/ACg8ocJEMTfp6sdli2AJhhYvgzuZRd8Kns-6e0HMxd92f2zGxazbPfhs=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','8vpHUU3Aa5OeoiOgEFUAehrTEbF2'),
(31,'a1d68bb3-829e-4843-9ade-6edd88b78902','Adriano Masini','adrianomasini@gmail.com',NULL,'$2a$12$264CHpY1CEQZTTYWrUZ.R.8Fjpa0Wbkt4oFAW6v1CEq3ys6jqlvA.','customer',NULL,1,NULL,NULL,'2026-01-10 00:50:17','0p7KBb7MF3ZK2XnAanKIg1sVsM73','https://lh3.googleusercontent.com/a/ACg8ocLBY207bv-nSmWcdyQoEYFhYSIpzzb7LK79GUOmzDpU-2u0Jl0X9w=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','0p7KBb7MF3ZK2XnAanKIg1sVsM73'),
(32,'3bb8a86a-9bba-4cc0-ab40-5728503f703f','Moni Sbrissa','monisesbrissa@gmail.com',NULL,'$2a$12$CEJCK8Tawv53X3PEa/2W/eVhtGiDcOb4KA4xVVB9.HQ4ChjVgisby','customer',NULL,1,NULL,NULL,'2026-01-10 00:52:16','o6ArVb1q7rXXSm9L2RoF2VudifI2','https://lh3.googleusercontent.com/a/ACg8ocKfP6PFAX-spKHarY3dUoCxzzw9AE1c9NhNrKVyRKo7HwZLfX4=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','o6ArVb1q7rXXSm9L2RoF2VudifI2'),
(33,'dd533d17-d90a-41f7-9ead-4af548776eb5','Ariely Gouveia','arielygandrade@gmail.com',NULL,'$2a$12$XjHp5bmbtweYem.JssQ.0etuZHP.EoaPC/LydWkfr8c6eXz9fCR7S','customer',NULL,1,NULL,NULL,'2026-01-10 01:47:59','wV6ghgXMPjcooo53GITMkamyRfs2','https://lh3.googleusercontent.com/a/ACg8ocKRqOSDOA2swm6plGpxaExAk7fW5WhlpY8GzAZOSN6I_eawZ-gI=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','wV6ghgXMPjcooo53GITMkamyRfs2'),
(34,'c821b997-7048-4b2e-8de6-937fc6243003','Andre Oliveira','andre.gafa@outlook.com',NULL,'$2a$12$h6.anNSp2XLBQr8/ZNu12ec/fuVkrHOryIa.OV2fArrbiHBz9ZKCm','customer',NULL,1,NULL,NULL,'2026-01-10 02:13:18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(35,'c3cbbe6b-0102-4aed-a391-4c67d8cd9a32','Thami Prandini','prandinithami@gmail.com',NULL,'$2a$12$hc5CS4lMEcepxY7VJEH0R.vjb4S9n4SV5TspO.yxxneDewlpZvIFy','customer',NULL,1,NULL,NULL,'2026-01-10 02:25:17','ujRa4r0pnThSuWAXNqW15KjvfyL2','https://lh3.googleusercontent.com/a/ACg8ocIKsY4cRnYuibnH6DK7vg3NAm-hcsE-TexVBMafNYQzH_A0kQcvXQ=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','ujRa4r0pnThSuWAXNqW15KjvfyL2'),
(36,'58788ba9-d791-4d16-993f-fd40bf9bc626','Raquel Prazeres de Castro','raquelprazeres@gmail.com',NULL,'$2a$12$j78SX5iaPySg.oHTA972q.9A7C.Yj7NWNDmVVmgwFe79hWd7aZ09K','customer',NULL,1,NULL,NULL,'2026-01-10 02:45:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(37,'e9af7123-f6b6-46b8-852b-c1a5235a4369','Branca Dias','brancadias@gmail.com',NULL,'$2a$12$T0VDem43ISplJR.VqudZpu7VCcnxuAnN3AM5c.2HOKSRE6rlRL6Nq','customer',NULL,1,NULL,NULL,'2026-01-10 05:05:18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'active',NULL),
(38,'db4fa13b-cc6d-4ce1-a9d8-916f43a17b81','Thyago Socrates','thiagomorollo@gmail.com',NULL,'$2a$12$A5e/UvUfp8CeMWQ9AqHqWuf0UEeZH98tD7OTA02q9xDldd0sJa0.6','customer',NULL,1,NULL,NULL,'2026-01-10 05:24:17','wgRcv89wIJaLmqt77KNoiJbejlW2','https://lh3.googleusercontent.com/a/ACg8ocLf5mDnPRipANt4hZt9HidMYglYAOm70v1x2Gzj_nYya1WKwZTjOA=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'active','wgRcv89wIJaLmqt77KNoiJbejlW2');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
