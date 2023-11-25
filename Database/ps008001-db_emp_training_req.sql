-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ps008001-db
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `emp_training_req`
--

DROP TABLE IF EXISTS `emp_training_req`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_training_req` (
  `req_id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int DEFAULT NULL,
  `emp_name` varchar(150) DEFAULT NULL,
  `emp_training_subject` varchar(60) DEFAULT NULL,
  `emp_training` varchar(60) DEFAULT NULL,
  `emp_start_date` date DEFAULT NULL,
  `emp_ending_date` date DEFAULT NULL,
  `spipa_location` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`req_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_training_req`
--

LOCK TABLES `emp_training_req` WRITE;
/*!40000 ALTER TABLE `emp_training_req` DISABLE KEYS */;
INSERT INTO `emp_training_req` VALUES (12,4,'Sanghavi Jainam P.','Gol-sponsered','Data-Management','2023-10-07','2024-04-15','ahemdabad'),(13,4,'Sanghavi Jainam P.','Gol-sponsered','Disaster-Management','2023-09-11','2024-04-15','ahemdabad'),(15,5,'Tomar Divyang R.','Foundation','ProGas-2023','2023-09-26','2024-04-05','ahemdabad'),(18,6,'Prabtani Om Rashminbheai','Foundation','ProGas-2023','2023-09-26','2024-04-05','ahemdabad'),(19,6,'Prabtani Om Rashminbheai','Gol-sponsered','Disaster-Management','2023-09-11','2024-04-15','ahemdabad'),(20,6,'Prabtani Om Rashminbheai','Gol-sponsered','Data-Management','2023-10-07','2024-04-15','ahemdabad'),(21,2,'Pokiya Yug D.','Foundation','ProGas-Mamlatdarbatch-2023','2023-09-26','2024-04-05','ahemdabad');
/*!40000 ALTER TABLE `emp_training_req` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-25 15:21:34
