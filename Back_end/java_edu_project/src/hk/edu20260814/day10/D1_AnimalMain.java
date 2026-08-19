package hk.edu20260814.day10;

public class D1_AnimalMain {
    public static void main(String[] args) {
        // 부모의 타입으로 자식을 생성
        D1_Animal human = new D1_Human();
        human.move(); // 자식에서 구현한 메서드가 실행(오버라이딩)
        // human.eat(); //설계도에 공개된 메서드만 사용가능

        // 자식에서 단독으로 구현한 메서드를 사용하려면 자식타입으로 형변환해야 된다.
        D1_Human humanEat = (D1_Human) human;
        humanEat.eat(); // 자식에서 단독으로 구현한 메서드
        humanEat.move(); // 오버라이딩한 메서드

        System.out.println("=====================================");
        // 다형성 발생원리 3가지
        // 1.부모의 타입으로 자식을 생성한다.
        D1_Animal animalH = new D1_Human();
        D1_Animal animalT = new D1_Tiger();
        D1_Animal animalE = new D1_Eagle();

        // 2.부모의 타입으로 자식을 참조한다.
        D1_Tiger tiger = new D1_Tiger();
        D1_Animal animalTT = tiger;

        moveAnimal(animalH);
        moveAnimal(animalT);
        moveAnimal(animalE);
    }

    // 자식타입의 서로 다른 여러 객체들을 참조할 수 있다.
    // ---> (파라미터에 부모 타입을 선언하면 가능해진다)
    public static void moveAnimal(D1_Animal animal) {
        // 전제조건: move()오버라이딩
        animal.move(); // 하나의 타입으로 여러 형태를 나타낼 수 있다.(다형성)
    }

    // 다형성을 활용하지 않았을 경우
    public static void moveAnimal(D1_Human human) {
        human.move();
    }

    public static void moveAnimal(D1_Tiger tiger) {
        tiger.move();
    }

    public static void moveAnimal(D1_Eagle eagle) {
        eagle.move();
    }

    // Object 클래스를 이용하는 방법(Object는 모든 클래스에 부모)
    public static void moveAnimal(Object obj) {
        if (obj instanceof D1_Human) {
            D1_Human human = (D1_Human) obj;
            human.eat();
        } else if (obj instanceof D1_Tiger) {
            D1_Tiger tiger = (D1_Tiger) obj;
            tiger.eat();
        }
    }
}
