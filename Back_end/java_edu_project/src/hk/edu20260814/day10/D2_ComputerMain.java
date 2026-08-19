package hk.edu20260814.day10;

public class D2_ComputerMain {
    public static void main(String[] args) {
        // D2_Computer com = new D2_Computer(); //불가능

        // 구현클래스의 객체생성
        D2_Computer desktop = new D2_DeskTop();

        desktop.turnOn();
        desktop.display();
        desktop.typing();
        desktop.turnOff();

        // D2_Computer noteBook = new D2_NoteBook(); //안됨
        D2_Computer MynoteBook = new D2_MyNoteBook();

        MynoteBook.turnOn();
        MynoteBook.display();
        MynoteBook.typing();
        MynoteBook.turnOff();
    }
}
