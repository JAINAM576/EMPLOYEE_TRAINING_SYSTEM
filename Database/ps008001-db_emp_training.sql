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
-- Table structure for table `emp_training`
--

DROP TABLE IF EXISTS `emp_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_training` (
  `emp_id` int NOT NULL,
  `emp_training` varchar(150) NOT NULL,
  `emp_training_subject` varchar(150) NOT NULL,
  `emp_start_date` date DEFAULT NULL,
  `emp_ending_date` date DEFAULT NULL,
  `spipa_location` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`emp_id`,`emp_training`,`emp_training_subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_training`
--

LOCK TABLES `emp_training` WRITE;
/*!40000 ALTER TABLE `emp_training` DISABLE KEYS */;
INSERT INTO `emp_training` VALUES (1,'Data-Management','Gol-sponsered','2023-10-07','2024-04-15','ahemdabad'),(1,'EDP-t1-2022','EDP','2023-11-14','2024-01-12','ahemdabad'),(1,'ProGas-2023','Foundation','2023-09-26','2024-04-05','ahemdabad'),(2,'Combating-corruption','Gol-sponsered','2023-09-11','2024-04-15','ahemdabad'),(2,'Data-Management','Gol-sponsered','2023-10-07','2024-04-15','ahemdabad'),(2,'EDP-t1-2022','EDP','2023-11-14','2024-01-12','ahemdabad'),(2,'ProGas-Mamlatdarbatch-2023','Foundation','2023-09-26','2024-04-05','ahemdabad'),(4,'EDP-t1-2022','EDP','2023-11-14','2024-01-12','ahemdabad'),(4,'ProGas-2023','Foundation','2023-09-26','2024-04-05','ahemdabad'),(5,'EDP-t1-2022','EDP','2023-11-14','2024-01-12','ahemdabad'),(5,'ProGas-Mamlatdarbatch-2023','Foundation','2023-09-26','2024-04-05','ahemdabad'),(6,'EDP-t1-2022','EDP','2023-11-14','2024-01-12','ahemdabad');
/*!40000 ALTER TABLE `emp_training` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-25 15:21:35
