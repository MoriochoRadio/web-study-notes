package hk.edu20260818.day11.day11_2;

public class D3_MagicSquareMain {

    // IMagic : make(), magicPrint()
    // MagicSquare : make()만 추상메서드
    // OddMagicSquare : make() 구현

    public static void main(String[] args) {
        OddMagicSquare odd = new OddMagicSquare(11);
        odd.make();
        odd.magicPrint();
    }
}