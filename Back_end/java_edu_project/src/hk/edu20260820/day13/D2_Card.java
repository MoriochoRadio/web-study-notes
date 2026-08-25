package hk.edu20260820.day13;

public class D2_Card {

    // 카드를 만들기 위해 필요한 값들 정의
    public static final String[] DECK = { "◆", "♥", "♣", "♠" };
    public static final String[] STECK = { "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };

    // 카드 한장을 저장할 필드 정의: "그림+숫자"
    private String card; // "♦2"

    public D2_Card() {
        init();
    }

    // 카드 한장을 만드는 기능
    public void init() {
        int deck = (int) (Math.random() * DECK.length);
        int steck = (int) (Math.random() * STECK.length);
        card = DECK[deck] + STECK[steck];
    }

    // 은닉화(캡슐화)
    public String getCard() {
        return card;
    }

    // [그림+숫자] 로 출력하려고 문자열 형식 정의
    @Override
    public String toString() {
        return "[" + card + "]";
    }

    // Card객체 내부에 멤버필드인 card끼리 비교하는 기능으로 재정의
    @Override
    public boolean equals(Object obj) {
        boolean isS = false;
        D2_Card ca = (D2_Card) obj;
        if (this.card.equals(ca.getCard())) {
            isS = true;
        }
        return isS;
    }

    // equals()를 오버라이딩하면 hashcode()도 오버라이딩해야 됨 (공식같은거임)
    @Override
    public int hashCode() {
        return card.hashCode() + 137;
    }
}
