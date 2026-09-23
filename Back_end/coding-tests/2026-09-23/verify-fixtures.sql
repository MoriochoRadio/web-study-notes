-- Session-only fixtures. Real tables and class data are not modified.
CREATE TEMPORARY TABLE ANIMAL_INS (ANIMAL_ID VARCHAR(20) PRIMARY KEY, NAME VARCHAR(40));
INSERT INTO ANIMAL_INS VALUES ('A500','보리'),('A100',NULL),('A400',''),('A200','체리'),('A300',NULL);
CREATE TEMPORARY TABLE PLACES (ID INT PRIMARY KEY, NAME VARCHAR(40), HOST_ID INT);
INSERT INTO PLACES VALUES (90,'host10-second',10),(50,'single-host',20),(70,'host30-third',30),(10,'host10-first',10),(60,'host30-second',30),(40,'host30-first',30);
