-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: ps008001-db
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `spipa_emp`
--

DROP TABLE IF EXISTS `spipa_emp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spipa_emp` (
  `spipa_emp_id` int NOT NULL AUTO_INCREMENT,
  `spipa_emp_role` varchar(50) DEFAULT 'operator',
  `spipa_name` varchar(150) DEFAULT NULL,
  `spipa_location` varchar(150) DEFAULT NULL,
  `spipa_contact` bigint DEFAULT NULL,
  `spipa_password` varchar(150) DEFAULT NULL,
  `spipa_email` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`spipa_emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spipa_emp`
--

LOCK TABLES `spipa_emp` WRITE;
/*!40000 ALTER TABLE `spipa_emp` DISABLE KEYS */;
INSERT INTO `spipa_emp` VALUES (1,'operator','Ahemdabad','Ahemdabad',9313869057,'hi123','parmarparth954@gmail.com'),(2,'Admin','Ahemdabad','Ahemdabad',828288282,'1234','jainamsanghai00*@gmail.com'),(3,'Operator','Ahemdabad','ghandinagar',1984982632,'1','jainam@gmail.com');
/*!40000 ALTER TABLE `spipa_emp` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-15 17:37:37
