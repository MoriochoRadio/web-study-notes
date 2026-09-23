import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.*;
import java.util.*;

// Run with a MariaDB JDBC driver and a LOCAL db.properties path; never commit credentials.
public class Sql18Verification {
    private static int checks;
    private static void expect(Connection c, String sql, String expected) throws Exception {
        List<String> rows = new ArrayList<>();
        try (Statement s=c.createStatement(); ResultSet r=s.executeQuery(sql)) {
            int columns=r.getMetaData().getColumnCount();
            while(r.next()) {
                StringJoiner row=new StringJoiner("|");
                for(int i=1;i<=columns;i++) row.add(String.valueOf(r.getObject(i)));
                rows.add(row.toString());
            }
        }
        String actual=String.join(",",rows);
        if(!expected.equals(actual)) throw new AssertionError("Expected "+expected+"; got "+actual);
        checks++;
        System.out.println("PASS " + checks + ": " + (actual.isEmpty()?"(empty)":actual));
    }
    public static void main(String[] args) throws Exception {
        if(args.length!=1) throw new IllegalArgumentException("Provide local db.properties path");
        Properties p=new Properties();
        try(var in=Files.newInputStream(Path.of(args[0]))) { p.load(in); }
        Class.forName(p.getProperty("driver"));
        String named=Files.readString(Path.of("named-animal-ids.sql"));
        String heavy=Files.readString(Path.of("heavy-user-places.sql"));
        String fixture=Files.readString(Path.of("verify-fixtures.sql"),StandardCharsets.UTF_8).replaceAll("(?m)^--.*$", "");
        try(Connection c=DriverManager.getConnection(p.getProperty("url"),p.getProperty("username"),p.getProperty("password")); Statement s=c.createStatement()) {
            System.out.println("Database: " + c.getMetaData().getDatabaseProductVersion());
            for(String sql:fixture.split(";")) if(!sql.isBlank()) s.execute(sql);
            expect(c,named,"A200,A400,A500");
            expect(c,"SELECT ANIMAL_ID FROM ANIMAL_INS WHERE NAME <> NULL","");
            expect(c,"SELECT ANIMAL_ID FROM ANIMAL_INS WHERE NAME IS NOT NULL AND NAME = ''","A400");
            expect(c,heavy,"10|host10-first|10,40|host30-first|30,60|host30-second|30,70|host30-third|30,90|host10-second|10");
            s.executeUpdate("DELETE FROM PLACES WHERE ID IN (90,60,70)");
            expect(c,heavy,"");
            s.executeUpdate("DELETE FROM ANIMAL_INS");
            expect(c,named,"");
            s.executeUpdate("DELETE FROM PLACES");
            expect(c,heavy,"");
            s.executeUpdate("INSERT INTO ANIMAL_INS VALUES ('A900',NULL)");
            expect(c,named,"");
            System.out.println("SQL: " + checks + " checks PASS; temporary tables only.");
        }
    }
}
