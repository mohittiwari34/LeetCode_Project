const mongoose = require('mongoose');
const Problem = require('../models/problem');
require('dotenv').config();

const questionData = {
    title: "Check Palindrome String",
    descripton: "Given a string, check whether it is a palindrome or not.",
    difficulty: "easy",
    tags: "string", // Admin panel schema expects valid enum string

    visibleTestCase: [
        {
            input: "madam",
            output: "Palindrome",
            explanation: "The string reads the same forward and backward."
        },
        {
            input: "hello",
            output: "Not Palindrome",
            explanation: "The reversed string is not equal to the original string."
        }
    ],

    hiddenTestCase: [
        {
            input: "a",
            output: "Palindrome"
        },
        {
            input: "abba",
            output: "Palindrome"
        }
    ],

    startCode: [
        {
            language: "javascript",
            intialCode: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf8').trim();

// write your code here`
        },
        {
            language: "c++",
            intialCode: `#include <iostream>
using namespace std;

int main() {
    string s;
    cin >> s;

    // write your code here

    return 0;
}`
        },
        {
            language: "java",
            intialCode: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();

        // write your code here
    }
}`
        }
    ],

    refrenceSolution: [
        {
            language: "javascript",
            completeCode: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf8').trim();

const r = s.split('').reverse().join('');

if (s === r) {
    console.log('Palindrome');
} else {
    console.log('Not Palindrome');
}`
        },
        {
            language: "c++",
            completeCode: `#include <iostream>
#include <stack>
using namespace std;

int main() {
    string s;
    cin >> s;

    stack<char> st;
    for (char c : s) st.push(c);
    while (!st.empty()) {
        cout << st.top();
        st.pop();
    }

    return 0;
}`
        },
        {
            language: "java",
            completeCode: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();

        String r = new StringBuilder(s).reverse().toString();

        if (s.equals(r)) {
            System.out.print("Palindrome");
        } else {
            System.out.print("Not Palindrome");
        }
    }
}`
        }
    ],
    problemCreator: "675f9e92b4e612345678abcd"
};

const seed = async () => {
    try {
        console.log("Connecting to DB...");
        console.log("URI:", process.env.DB_CONNECT_STRING); // Debug check
        await mongoose.connect(process.env.DB_CONNECT_STRING);
        console.log("Connected to MongoDB.");

        const existing = await Problem.findOne({ title: questionData.title });
        if (existing) {
            console.log("Problem already exists. Updating...");
            await Problem.updateOne({ title: questionData.title }, questionData);
            console.log("Problem updated.");
        } else {
            await Problem.create(questionData);
            console.log("Problem created successfully!");
        }

    } catch (err) {
        console.error("Error seeding problem:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
};

seed();
