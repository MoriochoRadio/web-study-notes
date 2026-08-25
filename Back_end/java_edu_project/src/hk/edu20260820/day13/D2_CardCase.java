package hk.edu20260820.day13;

import java.util.ArrayList;
import java.util.List;

public class D2_CardCase {
    // card 객체를 저장할 List 맴버필드를 정의
    private List<D2_Card> cards;

    // 카드의 총 장수
    private static final int NUMOFCARDS = D2_Card.DECK.length * D2_Card.STECK.length;

    public D2_CardCase() {
        cards = new ArrayList<>();
        shuffle();
    }

    // 카드를 생성해서 cards(List객체)에 저장하는 메서드 구현하자
    public void shuffle() {
        // Card객체 생성해서 cards에 add()하면 됨
        // List 에 contains() 메서드는 list 내부에 값을 검색하는 기능임
        // --> contains() 는 해시코드로 비교해서 내용이 같아도 다르다고 인식함
        int i = 0;
        while (true) {

            D2_Card cc = new D2_Card(); // 카드 한장 생성
            if (!cards.contains(cc)) { // cards에 중복된 card가 없다면
                // contains가 card.equals(newcard)
                cards.add(cc); // card 추가하기
                i++;
            }

            if (i == NUMOFCARDS) {
                break;
            }
        }
    }

    public List<D2_Card> getCards() {
        return cards;
    }

}
