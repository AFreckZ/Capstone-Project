/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for osx10.20 (arm64)
--
-- Host: localhost    Database: YaadQuest
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `businessowner`
--

DROP TABLE IF EXISTS `businessowner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `businessowner` (
  `bid` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `businesstype` enum('venue','event') DEFAULT NULL,
  PRIMARY KEY (`bid`),
  KEY `idx_businessowner_user_id` (`user_id`),
  CONSTRAINT `businessowner_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businessowner`
--

LOCK TABLES `businessowner` WRITE;
/*!40000 ALTER TABLE `businessowner` DISABLE KEYS */;
INSERT INTO `businessowner` VALUES
(1,4,'venue'),
(2,5,'event'),
(3,6,'venue'),
(4,7,'venue'),
(5,8,'venue'),
(6,11,'event'),
(7,12,'venue'),
(8,51,NULL),
(9,61,NULL);
/*!40000 ALTER TABLE `businessowner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Driver`
--

DROP TABLE IF EXISTS `Driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Driver` (
  `driver_id` int NOT NULL AUTO_INCREMENT,
  `agency_id` int DEFAULT NULL,
  `driver_name` varchar(100) NOT NULL,
  `driver_status` enum('Available','On Trip','Off Duty') DEFAULT 'Available',
  `license_number` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`driver_id`),
  KEY `agency_id` (`agency_id`),
  CONSTRAINT `driver_ibfk_1` FOREIGN KEY (`agency_id`) REFERENCES `TransportAgency` (`agency_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Driver`
--

LOCK TABLES `Driver` WRITE;
/*!40000 ALTER TABLE `Driver` DISABLE KEYS */;
INSERT INTO `Driver` VALUES
(1,1,'Marcus Campbell','Available','JM-DL-001234'),
(2,1,'Claudette Brown','Available','JM-DL-005678'),
(3,1,'Trevor Williams','On Trip','JM-DL-009012'),
(4,2,'Delroy Thompson','Available','JM-DL-003456'),
(5,2,'Paulette Davis','Available','JM-DL-007890'),
(6,2,'Winston Clarke','Off Duty','JM-DL-001122'),
(7,1,'Carlos Rodriguez','Available','DL123456'),
(8,1,'Maria Santos','On Trip','DL234567'),
(9,1,'James Wilson','Available','DL345678'),
(10,2,'David Kim','Available','DL456789'),
(11,2,'Lisa Chen','Off Duty','DL567890'),
(13,6,'Samantha Brown ','Off Duty','JM-DW-12345'),
(14,6,'Rushane Campbell','Available','JW-DW-27566'),
(15,6,'Cierra Ortega','On Trip','JM-DW-2123'),
(16,6,'John Cena','Available','JW-CM-4567'),
(19,6,'Greg Browm','On Trip','JW-DM-2245'),
(20,7,'Miana Jones','On Trip','355342');
/*!40000 ALTER TABLE `Driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `bid` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `event_type` enum('Concert','Party','Festival','Sport','Art/Talent Showcasing') NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `venue_location` varchar(200) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `description` text,
  `menu_image_path` varchar(500) DEFAULT NULL,
  `flyer_image_path` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `bid` (`bid`),
  KEY `idx_event_name` (`name`),
  KEY `idx_event_venue` (`venue_location`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_event_datetime` (`start_datetime`,`end_datetime`),
  KEY `idx_event_cost` (`cost`),
  KEY `idx_event_datetime_range` (`start_datetime`,`end_datetime`),
  KEY `idx_event_start_datetime` (`start_datetime`),
  KEY `idx_event_end_datetime` (`end_datetime`),
  KEY `idx_event_type_date_cost` (`event_type`,`start_datetime`,`cost`),
  KEY `idx_event_venue_location` (`venue_location`),
  KEY `idx_event_type_datetime` (`event_type`,`start_datetime`),
  KEY `idx_event_location` (`venue_location`),
  KEY `idx_event_active_dates` (`start_datetime`,`end_datetime`,`cost`),
  KEY `idx_event_value_cost` (`event_type`,`cost`,`start_datetime`),
  KEY `idx_event_time_conflicts` (`start_datetime`,`end_datetime`,`event_id`),
  KEY `idx_event_geographic` (`venue_location`,`start_datetime`),
  KEY `idx_event_scheduling` (`start_datetime`,`end_datetime`,`event_type`,`cost`),
  FULLTEXT KEY `name` (`name`,`description`,`venue_location`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `BusinessOwner` (`bid`) ON DELETE CASCADE,
  CONSTRAINT `event_chk_1` CHECK ((`end_datetime` > `start_datetime`))
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES
(17,2,'Reggae Sumfest','Concert','2025-07-14 20:00:00','2025-07-20 04:00:00','Catherine Hall, Montego Bay',3108.00,'Jamaica\'s premier reggae festival featuring international and local acts. Multi-day event with beach parties.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(18,2,'Rebel Salute','Concert','2025-08-19 18:00:00','2025-08-20 06:00:00','Grizzly\'s Plantation Cove',4762.00,'Annual roots reggae festival celebrating conscious music. Strictly no meat or alcohol sold on premises.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(19,2,'Sting','Concert','2025-12-26 20:00:00','2025-12-27 06:00:00','Jamworld, Portmore',3480.00,'The ultimate dancehall clash where artists compete lyrically. Not for the faint-hearted.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(20,2,'Jamaica Jazz and Blues','Concert','2025-09-25 19:00:00','2025-09-28 23:00:00','Various locations',4118.00,'International jazz artists perform at scenic Jamaican locations. Some free daytime events.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(21,2,'Reggae Month Concert','Concert','2026-02-24 18:00:00','2026-02-24 23:00:00','Emancipation Park, Kingston',3150.00,'Free outdoor concert celebrating Bob Marley\'s birthday month with top reggae acts.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(22,3,'Accompong Maroon Festival','Festival','2026-01-06 06:00:00','2026-01-06 18:00:00','Accompong Town, St. Elizabeth',0.00,'Annual celebration of Maroon independence featuring traditional dances, food, and ceremonies.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(23,3,'Jerk Festival','Festival','2025-11-05 11:00:00','2025-11-05 22:00:00','Portland',4396.00,'Celebration of Jamaica\'s jerk tradition with cooking competitions and tastings. Held in jerk pork\'s birthplace.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(24,3,'Ocho Rios Seafood Festival','Festival','2025-06-15 12:00:00','2025-06-16 20:00:00','Ocho Rios',3528.00,'Showcase of Jamaica\'s seafood prepared by top chefs. Cooking demos and live entertainment.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(25,3,'Blue Mountain Coffee Festival','Festival','2026-02-25 09:00:00','2026-02-25 17:00:00','New Castle',3455.00,'Celebration of Jamaica\'s world-famous coffee with tastings, farm tours, and barista competitions.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(26,3,'Carnival in Jamaica','Festival','2026-04-07 08:00:00','2026-04-07 23:00:00','Kingston',3689.00,'Colorful street parade with costumed bands, soca music, and dancing. \"The greatest show on earth\".',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(27,3,'Jamaica Invitational','Sport','2026-05-05 17:00:00','2026-05-05 22:00:00','National Stadium, Kingston',3082.00,'International track and field meet featuring Olympic athletes. Bolt and Fraser-Pryce often appear.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(28,3,'Reggae Marathon','Sport','2025-12-03 05:00:00','2025-12-03 11:00:00','Negril',3346.00,'Scenic beachside race with reggae bands along the course. Options for full/half marathon or 10K.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(29,3,'Red Stripe Premier League','Sport','2025-09-17 15:00:00','2026-05-26 21:00:00','Various stadiums',4481.00,'Jamaica\'s top football league featuring island\'s best teams and players.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(30,3,'Surfing Competition','Sport','2026-01-21 08:00:00','2026-01-21 17:00:00','Boston Bay',0.00,'Annual surfing competition at Jamaica\'s best surf spot. Open to spectators free of charge.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(31,3,'Jamaica Open Golf','Sport','2026-02-09 07:00:00','2026-02-11 18:00:00','Tryall Club',3367.00,'Prestigious golf tournament attracting international players to Jamaica\'s championship courses.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(32,2,'Kingston on the Edge','Art/Talent Showcasing','2025-06-15 10:00:00','2025-06-23 22:00:00','Various locations, Kingston',0.00,'Annual urban arts festival showcasing visual arts, music, dance, and theater across Kingston.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(33,2,'Jamaica Biennial','Art/Talent Showcasing','2026-03-02 10:00:00','2026-05-31 17:00:00','National Gallery, Kingston',4394.00,'Premier contemporary art exhibition featuring established and emerging Jamaican artists.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(34,2,'LTM Pantomime','Art/Talent Showcasing','2025-12-26 10:00:00','2026-04-21 22:00:00','Little Theatre, Kingston',4866.00,'Jamaica\'s annual theatrical tradition mixing folk tales, music, and comedy. Runs for months.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(35,2,'Rastafari Indigenous Village','Art/Talent Showcasing','2026-03-15 09:00:00','2026-03-15 17:00:00','Montego Bay',4147.00,'Cultural immersion experience with drumming, crafts, and Ital cooking demonstrations.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(36,2,'Poetry in Motion','Art/Talent Showcasing','2026-02-25 18:00:00','2026-02-25 22:00:00','Emancipation Park',3139.00,'Monthly spoken word event featuring Jamaica\'s top poets and open mic sessions.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(37,2,'Dream Weekend','Party','2025-07-31 22:00:00','2025-08-05 06:00:00','Negril',4257.00,'Jamaica\'s biggest party weekend featuring multiple events like Beach J\'ouvert and All White.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(38,2,'Bacchanal Jamaica','Party','2026-02-11 20:00:00','2026-04-07 04:00:00','Mas Camp, Kingston',4865.00,'Carnival season parties leading up to road march. Soca music, costumes, and Caribbean vibes.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(39,2,'Upscale Saturdays','Party','2025-06-11 23:00:00','2025-06-12 06:00:00','The Deck, Kingston',4554.00,'Weekly upscale party attracting Kingston\'s elite. Strict dress code enforced.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(40,2,'Sunset Beach Bash','Party','2025-07-16 14:00:00','2025-07-16 22:00:00','Seven Mile Beach',3174.00,'All-day beach party with multiple DJs, swimming, and water sports. Family-friendly until 6pm.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(41,2,'MoBay White Party','Party','2026-01-28 20:00:00','2026-01-29 04:00:00','Half Moon Resort',3212.00,'Exclusive all-white attire party with international DJs. One of Montego Bay\'s premier events.',NULL,NULL,'2025-06-03 19:03:44','2025-06-03 19:03:58'),
(44,8,'I love Soca','Party','2025-06-27 04:28:00','2025-06-27 14:28:00','Plantation Cove , Priory, St. Ann',3536.00,'Come enjoy good soca music at this all inclusive cooler fete.',NULL,'/uploads/events/flyerImage-1750141882431-658231106.jpeg','2025-06-17 06:31:22','2025-06-17 06:31:22');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Excursion`
--

DROP TABLE IF EXISTS `Excursion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Excursion` (
  `excursion_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `description` text,
  `status` enum('Planning','Confirmed','Completed','Cancelled') DEFAULT 'Planning',
  PRIMARY KEY (`excursion_id`),
  KEY `idx_excursion_cost` (`cost`),
  CONSTRAINT `excursion_chk_1` CHECK ((`end_datetime` > `start_datetime`))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Excursion`
--

LOCK TABLES `Excursion` WRITE;
/*!40000 ALTER TABLE `Excursion` DISABLE KEYS */;
INSERT INTO `Excursion` VALUES
(1,'Blue Mountain Adventure Day','2024-12-16 08:00:00','2024-12-16 16:00:00',85.00,'Coffee plantation tour with hiking and local lunch','Confirmed'),
(2,'Negril Sunset Experience','2024-12-17 15:00:00','2024-12-17 21:00:00',65.00,'Seven Mile Beach relaxation followed by Rick\'s Cafe sunset','Confirmed'),
(3,'Kingston Cultural Journey','2024-12-18 09:00:00','2024-12-18 17:00:00',75.00,'Bob Marley Museum, Devon House, and local jerk food experience','Planning'),
(4,'Ocho Rios Waterfall Adventure','2024-12-19 09:00:00','2024-12-19 15:00:00',90.00,'Dunn\'s River Falls climbing and Blue Hole swimming','Confirmed'),
(5,'Rum and Reggae Evening','2024-12-20 16:00:00','2024-12-20 23:00:00',95.00,'Appleton Estate tour followed by live reggae at Bob Marley Bar','Planning'),
(6,'Beach & Adventure Day','2024-06-16 09:00:00','2024-06-16 18:00:00',120.00,'Full day combining beach relaxation and mountain adventures','Confirmed'),
(7,'Cultural Food Tour','2024-07-02 11:00:00','2024-07-02 16:00:00',85.00,'Guided tour through local restaurants and cultural sites','Planning'),
(8,'Night Life Experience','2024-07-03 20:00:00','2024-07-04 01:00:00',95.00,'Evening tour of best nightlife spots','Confirmed'),
(9,'Adventure Sports Weekend','2024-08-06 08:00:00','2024-08-06 19:00:00',150.00,'Full day of outdoor and indoor adventure activities','Planning'),
(10,'Festival & Dining Experience','2024-08-10 12:00:00','2024-08-10 22:00:00',130.00,'Food festival combined with fine dining experience','Confirmed');
/*!40000 ALTER TABLE `Excursion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tourist`
--

DROP TABLE IF EXISTS `tourist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tourist` (
  `tourist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `trip_start` date DEFAULT NULL,
  `trip_end` date DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `need_for_transport` tinyint(1) DEFAULT '0',
  `preferred_start` time DEFAULT NULL,
  `preferred_end` time DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `preferred_dates` json DEFAULT NULL,
  PRIMARY KEY (`tourist_id`),
  KEY `idx_tourist_user_id` (`user_id`),
  KEY `idx_tourist_trip_dates` (`trip_start`,`trip_end`),
  KEY `idx_tourist_budget` (`budget`),
  KEY `idx_tourist_user_trip` (`user_id`,`trip_start`,`trip_end`),
  KEY `idx_tourist_preferred_times` (`preferred_start`,`preferred_end`),
  KEY `idx_tourist_transport` (`need_for_transport`),
  KEY `idx_tourist_complete_profile` (`tourist_id`,`trip_start`,`trip_end`,`budget`,`preferred_start`,`preferred_end`),
  CONSTRAINT `tourist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tourist`
--

LOCK TABLES `tourist` WRITE;
/*!40000 ALTER TABLE `tourist` DISABLE KEYS */;
INSERT INTO `tourist` VALUES
(10,41,'2025-06-19','2025-07-05',34965.00,0,'09:00:00','17:00:00','RIU','[\"2025-06-27\"]'),
(11,49,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL),
(12,53,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL),
(13,54,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL),
(14,55,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL),
(15,56,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL),
(16,58,'2025-06-20','2025-07-12',34965.00,0,'06:00:00','22:00:00','RIU','[\"2025-06-20\", \"2025-06-26\", \"2025-07-04\"]');
/*!40000 ALTER TABLE `tourist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tourist_preferences`
--

DROP TABLE IF EXISTS `tourist_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tourist_preferences` (
  `preference_id` int NOT NULL AUTO_INCREMENT,
  `tourist_id` int NOT NULL,
  `preferences` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`preference_id`),
  UNIQUE KEY `unique_tourist_prefs` (`tourist_id`),
  KEY `idx_tourist_preferences_tourist_id` (`tourist_id`),
  KEY `idx_tourist_preferences_created` (`tourist_id`,`created_at` DESC),
  KEY `idx_tourist_preferences_updated` (`tourist_id`,`updated_at` DESC),
  CONSTRAINT `tourist_preferences_ibfk_1` FOREIGN KEY (`tourist_id`) REFERENCES `tourist` (`tourist_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tourist_preferences`
--

LOCK TABLES `tourist_preferences` WRITE;
/*!40000 ALTER TABLE `tourist_preferences` DISABLE KEYS */;
INSERT INTO `tourist_preferences` VALUES
(1,10,'[{\"tag\": \"Pristine Beaches\", \"weight\": 3}, {\"tag\": \"Local Food/Dining\", \"weight\": 2}, {\"tag\": \"Unique Food & Dining\", \"weight\": 1}]','2025-06-13 06:56:47','2025-06-25 05:51:37'),
(39,16,'[{\"tag\": \"Concert\", \"weight\": 4}, {\"tag\": \"Museum/Historical Site\", \"weight\": 3}, {\"tag\": \"Local Food/Dining\", \"weight\": 2}, {\"tag\": \"Club/Bar/Party\", \"weight\": 1}]','2025-06-26 03:13:32','2025-06-26 05:02:22');
/*!40000 ALTER TABLE `tourist_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TransportAgency`
--

DROP TABLE IF EXISTS `TransportAgency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `TransportAgency` (
  `agency_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `travel_rate` decimal(10,2) DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`agency_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transportagency_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TransportAgency`
--

LOCK TABLES `TransportAgency` WRITE;
/*!40000 ALTER TABLE `TransportAgency` DISABLE KEYS */;
INSERT INTO `TransportAgency` VALUES
(1,15,35.00,'Rainbow Transport Jamaica'),
(2,16,42.00,'Island Routes Transportation'),
(3,9,0.75,'City Transport Services'),
(4,10,1.25,'Island Tours & Transport'),
(5,52,NULL,NULL),
(6,57,350.00,NULL),
(7,66,350.00,'miana');
/*!40000 ALTER TABLE `TransportAgency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `usertype` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(1,'john_doe','hashed_password1','john@example.com',NULL),
(2,'jane_smith','hashed_password2','jane@example.com',NULL),
(3,'bob_johnson','hashed_password3','bob@example.com',NULL),
(4,'alice_wonder','hashed_password4','alice@example.com',NULL),
(5,'mike_adams','hashed_password5','mike@example.com',NULL),
(6,'sara_connor','hashed_password6','sara@example.com',NULL),
(7,'travel_agency1','hashed_password7','agency1@example.com',NULL),
(8,'beach_resort','hashed_password8','resort@example.com',NULL),
(9,'museum_admin','hashed_password9','museum@example.com',NULL),
(10,'event_planner','hashed_password10','events@example.com',NULL),
(11,'john_tourist','hashed_password_1','john@email.com',NULL),
(12,'sarah_explorer','hashed_password_2','sarah@email.com',NULL),
(13,'mike_adventure','hashed_password_3','mike@email.com',NULL),
(14,'lisa_culture','hashed_password_4','lisa@email.com',NULL),
(15,'bob_beach','hashed_password_5','bob@email.com',NULL),
(16,'reggae_bar_owner','hashed_password_6','reggaebar@email.com',NULL),
(17,'blue_mountain_tours','hashed_password_7','bluemountain@email.com',NULL),
(18,'ricks_cafe_owner','hashed_password_8','rickscafe@email.com',NULL),
(19,'dunn_river_owner','hashed_password_9','dunnriver@email.com',NULL),
(20,'marley_museum_owner','hashed_password_10','marleymuseum@email.com',NULL),
(21,'jerk_pit_owner','hashed_password_11','jerkpit@email.com',NULL),
(22,'reggae_sumfest_org','hashed_password_12','sumfest@email.com',NULL),
(23,'blue_hole_owner','hashed_password_13','bluehole@email.com',NULL),
(24,'appleton_estate_owner','hashed_password_14','appleton@email.com',NULL),
(25,'rainbow_transport','hashed_password_15','rainbow@transport.com',NULL),
(26,'island_routes','hashed_password_16','island@routes.com',NULL),
(27,'seven_mile_owner','hashed_password_17','sevenmile@email.com',NULL),
(28,'devon_house_owner','hashed_password_18','devonhouse@email.com',NULL),
(41,'lia','$2b$10$txQlzYfzMNrn9aJzZNGpNu1LwHZs2J2SyK2VrptMVhF6MiG9Tq.eK','lia@gmail.com','tourist'),
(42,'lia2','$2b$10$zBdXBl9jevg1IOl3Z1XorOj0.FUNXa.Tnq.8XCPMJyaOIw8DPyLku','lia2@gmail.com','business-owner'),
(43,'liand','$2b$10$SQl6m0Vbk9dl1kOWM4bnnujXnWogkyPfEJGB2c.jtxjDH7hT4DynC','lia22@gmail.com','transport-agency'),
(45,'liandr','$2b$10$3Zsgr70wZFJ9adP7yln2iuaisN/M7uShsRYtm/DSKqyZbx3yRsI4u','lo@gmail.com','transport-agency'),
(46,'olol','$2b$10$KncFuwsJD0LqDegg.dqktOGFGQLQXFuz5qakt8jQOV7Rl2fhxJxd6','olo@gmail.com','business-owner'),
(47,'liangr','$2b$10$NsXaPIvLxI6lyxhL/195ueZ.NIP6Anv32kU4VN1vrW0WlrqEeZNji','liat@gmail.com','business-owner'),
(48,'tay','$2b$10$XQq9pzEFyfiVKovSDptV3uIGwKTdwTebTnXacciZWg2FP8LWr0HvC','tay123@gmail.com','business-owner'),
(49,'polly pocket','$2b$10$VaL68Tuqu6NLvMALkM2SweLTi2WYtYHZaa8C/MfHXNYIpTum8r/lm','polly123@gmail.com','tourist'),
(51,'princess peach ','$2b$10$X7QDYyEP36R.5Eh39dD7AOxGnBuiGC8O8nQI4kCDvgKEwdjKEOG8i','peachyday@gmail.com','business-owner'),
(52,'freedom fighter','$2b$10$I8jfdrsGAR8goAUrNur3TuFGc8y4uHcPsCQa52lmmS0QYRDfxUxl.','free@gmail.com','transport-agency'),
(53,'liata','$2b$10$5qzfKhdbiboHlHrshNk/Venri2to4SBaHEOeZzeSnZSGFTUV1ACuu','liata@gmail.com','tourist'),
(54,'liaw','$2b$10$PRuPAc0KF92xVm9UNVJR6.XA89k5pc/lcS.23vatDmpg2jgoFt.Le','liaw@gmail.com','tourist'),
(55,'daniel ','$2b$10$.BsNolNRsuSA//XWgZbgCO5Bv0HWBc76fU6TYvZGDBvs6ii3ciBAO','dannyboy@gmail.com','tourist'),
(56,'adam','$2b$10$5PdnfWl9SkwinVT1F5s24.zK6dJgogyic0pF91K2PqNHkPOtpLfBG','adam@gmail.com','tourist'),
(57,'Rainbow tours','$2b$10$NfZ3wlTNEv/GBA.ShfIknuNIbdwfYyQxAbPmh0p7qNftu63MVIZ86','raintour101@gmail.com','transport-agency'),
(58,'mia ','$2b$10$oInr2cDJFhFdz669v1qXxuCu7quSLr5xiQbpBDAHw0Hq4INh2FamW','mia@gmail.com','tourist'),
(61,'drivetours','$2b$10$SiCw7KOEGtfOmCz6cdVNWeZ0VYxRh18C8D0MV5xZW9icbbOTlzEK6','name@gmail.com','business-owner'),
(66,'miana','$2b$10$hg/XzKaks9dJyJ2HRQBUXuDCelHPxNp.QdYud.U73aQVWv8jAK6JK','miana2@gmail.com','transport-agency');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue` (
  `venue_id` int NOT NULL AUTO_INCREMENT,
  `bid` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `venue_type` enum('Beach/River','Outdoor Adventure','Indoor Adventure','Museum/Historical Site','Food & Dining (Local)','Food & Dining (Unique)','Club/Bar/Party','Live Music','Festival') NOT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `address` varchar(200) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `days_open` json DEFAULT NULL,
  PRIMARY KEY (`venue_id`),
  KEY `bid` (`bid`),
  KEY `idx_venue_active_type_cost` (`is_active`,`venue_type`,`cost`),
  KEY `idx_venue_is_active` (`is_active`),
  KEY `idx_venue_type` (`venue_type`),
  KEY `idx_venue_cost` (`cost`),
  KEY `idx_venue_opening_time` (`opening_time`),
  KEY `idx_venue_closing_time` (`closing_time`),
  KEY `idx_venue_active_status` (`is_active`),
  KEY `idx_venue_cost_range` (`cost`),
  KEY `idx_venue_type_active` (`venue_type`,`is_active`),
  KEY `idx_venue_hours` (`opening_time`,`closing_time`),
  KEY `idx_venue_days_composite` (`is_active`,`opening_time`,`closing_time`),
  KEY `idx_venue_value_cost` (`venue_type`,`cost`,`is_active`),
  KEY `idx_venue_time_slots` (`opening_time`,`closing_time`,`venue_id`),
  KEY `idx_venue_availability` (`is_active`,`venue_type`,`cost`,`opening_time`,`closing_time`),
  CONSTRAINT `venue_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `BusinessOwner` (`bid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue`
--

LOCK TABLES `venue` WRITE;
/*!40000 ALTER TABLE `venue` DISABLE KEYS */;
INSERT INTO `venue` VALUES
(54,1,'Seven Mile Beach','Beach/River','06:00:00','18:00:00',0.00,'Negril, Westmoreland','World-famous public beach stretching seven miles with soft white sand and clear waters. Free access with paid amenities available.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(55,3,'Doctor\'s Cave Beach','Beach/River','08:00:00','17:30:00',2500.00,'Gloucester Ave, Montego Bay','Historic beach club with mineral springs said to have healing properties. Entry fee includes changing rooms and showers.',1,'{\"friday\": true, \"monday\": true, \"sunday\": false, \"tuesday\": true, \"saturday\": false, \"thursday\": true, \"wednesday\": true}'),
(56,4,'Boston Bay','Beach/River','06:00:00','18:00:00',2000.00,'Portland','Surfing hotspot with Jamaica\'s best waves. Famous for its jerk pork stands right on the beach.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(57,5,'Frenchman\'s Cove','Beach/River','08:30:00','16:30:00',2800.00,'Port Antonio','Picturesque paid beach where a freshwater river meets the Caribbean Sea, creating unique swimming areas.',1,'{\"friday\": true, \"monday\": true, \"sunday\": false, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(58,7,'Hellshire Beach','Beach/River','06:00:00','20:00:00',0.00,'Portmore, St. Catherine','Popular local beach known for its fried fish and lively Sunday atmosphere.',1,'{\"friday\": false, \"monday\": false, \"sunday\": true, \"tuesday\": false, \"saturday\": true, \"thursday\": false, \"wednesday\": false}'),
(59,4,'Dunn\'s River Falls','Outdoor Adventure','08:30:00','16:00:00',3000.00,'Ocho Rios','World-famous 600-foot terraced waterfall that visitors can climb with guides. Natural pools at base.',1,'{\"friday\": true, \"monday\": true, \"sunday\": false, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(60,4,'Blue Hole','Outdoor Adventure','08:00:00','17:00:00',2700.00,'Ocho Rios','Series of deep limestone sinkholes with rope swings and cliff jumping spots in the jungle.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(61,4,'Mystic Mountain','Outdoor Adventure','09:00:00','17:00:00',6500.00,'Ocho Rios','Rainforest attraction featuring bobsled rides inspired by Jamaica\'s Olympic team, ziplines, and sky explorer.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(62,5,'YS Falls','Outdoor Adventure','09:30:00','15:30:00',2600.00,'St. Elizabeth','Seven-tiered waterfall on a working cattle farm with natural pools and ziplines over the falls.',1,'{\"friday\": true, \"monday\": false, \"sunday\": true, \"tuesday\": false, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(63,3,'Green Grotto Caves','Outdoor Adventure','09:00:00','16:00:00',2500.00,'Discovery Bay','Historic caves used by indigenous Tainos, Spanish, and as a rum storage during WWII. Guided tours available.',1,'{\"friday\": true, \"monday\": true, \"sunday\": false, \"tuesday\": true, \"saturday\": false, \"thursday\": true, \"wednesday\": true}'),
(64,4,'Bob Marley Museum','Museum/Historical Site','09:30:00','16:00:00',3000.00,'56 Hope Rd, Kingston','The legendary musician\'s former home and recording studio, preserved with original furnishings and gold records.',1,'{\"friday\": true, \"monday\": false, \"sunday\": false, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(65,4,'Devon House','Museum/Historical Site','09:00:00','17:00:00',2500.00,'26 Hope Rd, Kingston','19th-century Georgian mansion built by Jamaica\'s first Black millionaire. Famous for its ice cream.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(66,4,'Port Royal','Museum/Historical Site','09:00:00','17:00:00',2800.00,'Port Royal','Former pirate capital of the Caribbean with maritime museum and historic Fort Charles.',1,'{\"friday\": true, \"monday\": true, \"sunday\": false, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(67,4,'Rose Hall Great House','Museum/Historical Site','09:00:00','18:00:00',3000.00,'Rose Hall, Montego Bay','Restored 18th-century plantation house with famous \"White Witch\" ghost legend. Night tours available.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(68,4,'Trench Town Culture Yard','Museum/Historical Site','09:00:00','17:00:00',2500.00,'Trench Town, Kingston','Birthplace of reggae music where Bob Marley and other legends lived. Community-run museum.',1,'{\"friday\": true, \"monday\": false, \"sunday\": false, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(69,3,'Scotchies','Food & Dining (Local)','10:00:00','22:00:00',3500.00,'Drax Hall, St. Ann','Authentic jerk center cooking over pimento wood. Famous for jerk chicken and pork with festival bread.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(70,5,'Miss T\'s Kitchen','Food & Dining (Local)','11:00:00','21:00:00',4500.00,'Ocho Rios','Cozy spot serving Jamaican home-style cooking like oxtail, curry goat, and ackee & saltfish.',1,'{\"friday\": true, \"monday\": true, \"sunday\": false, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(71,7,'Peppa\'s Jerk Centre','Food & Dining (Local)','11:00:00','23:00:00',2800.00,'Southaven, Kingston','Popular jerk spot with live music on weekends. Try their jerk sausage and roasted breadfruit.',1,'{\"friday\": true, \"monday\": false, \"sunday\": true, \"tuesday\": false, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(72,4,'Border Jerk','Food & Dining (Local)','10:00:00','02:00:00',3200.00,'Border Ave, Montego Bay','Late-night jerk spot popular with locals and tourists. Known for fiery jerk sauce.',1,'{\"friday\": true, \"monday\": true, \"sunday\": false, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(74,1,'Pier 1','Club/Bar/Party','18:00:00','04:00:00',3000.00,'Howard Cooke Blvd, Montego Bay','Waterfront nightclub with regular dancehall nights and international DJs. Cover charge varies by event.',1,'{\"friday\": true, \"monday\": false, \"sunday\": false, \"tuesday\": false, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(75,1,'Quad Nightclub','Club/Bar/Party','22:00:00','05:00:00',3000.00,'New Kingston','Upscale multi-level club with different music genres on each floor. Dress code enforced.',1,'{\"friday\": true, \"monday\": false, \"sunday\": false, \"tuesday\": false, \"saturday\": true, \"thursday\": true, \"wednesday\": false}'),
(76,1,'Margaritaville','Club/Bar/Party','11:00:00','02:00:00',2500.00,'Hip Strip, Montego Bay','Beachfront party spot with water trampoline and famous \"Bob Marley Shot\". Tourist-friendly atmosphere.',1,'{\"friday\": true, \"monday\": true, \"sunday\": true, \"tuesday\": true, \"saturday\": true, \"thursday\": true, \"wednesday\": true}'),
(77,1,'Jungle Nightclub','Club/Bar/Party','23:00:00','06:00:00',2800.00,'Ocho Rios','Massive open-air club with themed nights and local dancehall artists. Known for late-night parties.',1,'{\"friday\": true, \"monday\": false, \"sunday\": false, \"tuesday\": false, \"saturday\": true, \"thursday\": true, \"wednesday\": false}'),
(78,1,'Weekenz','Club/Bar/Party','21:00:00','04:00:00',2500.00,'Portmore','Popular local dancehall spot where Jamaican artists often perform unreleased music.',1,'{\"friday\": true, \"monday\": false, \"sunday\": false, \"tuesday\": false, \"saturday\": true, \"thursday\": false, \"wednesday\": false}'),
(79,8,'Rick\'s Cafe','Food & Dining (Local)','12:00:00','22:00:00',7000.00,'West End Road , Negril, Westmoreland','Longtime bar/eatery offering Caribbean grub & cocktails, plus a pool & cliffside jumping spots.',1,'[\"Monday\", \"Friday\", \"Saturday\", \"Tuesday\", \"Wednesday\", \"Sunday\", \"Thursday\"]'),
(80,8,'Luminous Lagoon Glistening Waters','Outdoor Adventure','17:30:00','22:00:00',4000.00,'Rock , Falmouth, Trelawny','One of Jamaica’s most magical natural wonders, the Luminous Lagoon glows at night due to bioluminescent microorganisms. Guided boat tours let visitors swim in the sparkling waters, creating an ethereal light show with every movement. A bucket-list experience for nature lovers.',1,'[\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"]');
/*!40000 ALTER TABLE `venue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-06-26  1:04:04
