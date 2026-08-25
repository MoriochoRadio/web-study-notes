package hk.edu20260818.day11.day11_2;

public class D3_MagicSquareMain {

    // IMagic : make(), magicPrint()
    // MagicSquare : make()만 추상메서드
    // OddMagicSquare : make() 구현

    public static void main(String[] args) {

        // OddMagicSquare odd = new OddMagicSquare(3);
        // odd.make();
        // odd.magicPrint();

        // System.out.println();

        // EvenMagicSquare ev = new EvenMagicSquare(4);
        // ev.make();
        // ev.magicPrint();

        // System.out.println();

        // D1_SixMagicSquare six = new D1_SixMagicSquare(10);
        // six.make();
        // six.magicPrint();

        // 메서드를 통해 객체 얻어옴: new 사용 못함
        D2_MagicFactory fac = D2_MagicFactory.getInstance();
        Interface_Magic magic = fac.factory();
        if (magic == null) {
            System.out.println("다시입력하세요");
        } else {
            D1_MagicUtil.magicRun(magic);
        }

    }

}