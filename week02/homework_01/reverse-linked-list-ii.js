// https://leetcode-cn.com/problems/reverse-linked-list-ii/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function ListNode(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
}

ListNode.prototype.toString = function () {
    const arr = [];
    let node = this;
    while (node != null) {
        arr.push(node.val);
        node = node.next;
    }
    return arr.length ? arr.join() : "null";
};

/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
    const dummy = new ListNode(null, head);

    let leftHead = dummy;
    for (let i = 1; i < left; i += 1) {
        leftHead = leftHead.next; // now leftHead is at the node before left index
    }

    const start = leftHead.next; // store the first node which will be reversed
    let pre = start,
        cur = start.next;
    for (let i = left; i < right; i += 1) {
        [cur.next, pre, cur] = [pre, cur, cur.next];
    }

    leftHead.next = pre;
    start.next = cur;

    return dummy.next;
};

// test case 1
const l1 = [5, 4, 3, 2, 1].reduce((pre, cur) => {
    const node = new ListNode(cur);
    node.next = pre;
    return node;
}, null);
console.log(l1.toString()); // "1,2,3,4,5"
console.log(reverseBetween(l1, 2, 4).toString()); // "1,4,3,2,5"

// test case 2
const l2 = new ListNode(5);
console.log(l2.toString()); // "5"
console.log(reverseBetween(l2, 1, 1).toString()); // "5"
