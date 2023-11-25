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
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `emp_name` varchar(150) DEFAULT NULL,
  `emp_email` varchar(60) DEFAULT NULL,
  `emp_birth_date` date DEFAULT NULL,
  `emp_phone_no` bigint DEFAULT NULL,
  `emp_dept_name` varchar(150) DEFAULT NULL,
  `emp_password` varchar(150) DEFAULT NULL,
  `emp_operator` varchar(150) DEFAULT NULL,
  `emp_gender` varchar(10) DEFAULT NULL,
  `status` int DEFAULT '1',
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Parmar Parth K.','parmarparth954@gmail.com','2004-12-06',9313869057,'Education Department, Gujarat','hi123','2','Male',1),(2,'Pokiya Yug D.','yugdpokiya@gmail.com','2005-09-25',9313869057,'Education Department, Gujarat','hi123','2','Male',1),(3,'Soni Devang G.','parmarparth954@gmail.com','2005-11-07',9313869057,'Education Department, Gujarat','hi123','2','Male',1),(4,'Sanghavi Jainam P.','parmarparth954@gmail.com','2005-08-28',9313869057,'Education Department, Gujarat','hi123','2','Male',1),(5,'Tomar Divyang R.','parmarparth954@gmail.com','2005-10-31',9313869057,'Education Department, Gujarat','hi123','2','Male',1),(6,'Prabtani Om Rashminbheai','parmarparth954@gmail.com','2005-10-31',9313869057,'Education Department, Gujarat','dewigfoehf','2','Male',1);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
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
