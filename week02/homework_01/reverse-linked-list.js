// https://leetcode-cn.com/problems/reverse-linked-list/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

function ListNode(val) {
    this.val = val;
    this.next = null;
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
 * @return {ListNode}
 */
var reverseList = function (head) {
    let pre = null,
        cur = head;
    while (cur != null) {
        [cur.next, pre, cur] = [pre, cur, cur.next];
    }
    return pre;
};

// test case 1
const l1 = [5, 4, 3, 2, 1].reduce((pre, cur) => {
    const node = new ListNode(cur);
    node.next = pre;
    return node;
}, null);
console.log(l1.toString()); // "1,2,3,4,5"
console.log(reverseList(l1).toString()); // "5,4,3,2,1"

// test case 2
const l2 = [2, 1].reduce((pre, cur) => {
    const node = new ListNode(cur);
    node.next = pre;
    return node;
}, null);
console.log(l2.toString()); // "1,2"
console.log(reverseList(l2).toString()); // "2,1"

// test case 3
const l3 = null;
console.log(l3); // null
console.log(reverseList(l3)); // null
