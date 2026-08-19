package hk.edu20260814.day10;

public class D2_MyNoteBook extends D2_NoteBook {

    // 하위 클래스에서 모두 구현을 하게 되면 상위 클래스들의 기능을 모두 사용할 수 있다.
    @Override
    public void typing() {
        System.out.println("MyNoteBook typing기능입니다.");
    }
}
