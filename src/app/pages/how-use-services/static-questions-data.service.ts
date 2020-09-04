import { QuestionsData } from "../../models/ServicesQuestionData";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class StaticQuestionsData {
  constructor() {}
style:string = "height: 500px;max-width: 600px;display: block;margin: 24px;"
  data: QuestionsData[] = [
    {
      question: { index: "1", value: "How to access the system?" },
      answer: [
        {
          answer: { index: "a", value: "Web" },
          subanswers: [
            {
              index: "i",
              value:
                "   The web client lets you access your machine from a web browser without the lengthy installation process",
              subanswers: [],
            },
            {
              index: "ii",
              value: "  We support all the latest browsers: ",
              subanswers: [
                { index: "1", value: "  Microsoft Edge" },
                { index: "2", value: "  Google Chrome" },
                { index: "3", value: "  Internet Explorer" },
                { index: "4", value: "  Apple Safari" },
                { index: "5", value: "  Mozilla Firefox" },
              ],
            },
            {
              index: "iii",
              value:
                " Open <a href='javascript:void(0)'>this link </a>and login with your credentials",
              subanswers: [],
            },
          ],
        },
        {
          answer: { index: "b", value: " Windows" },
          subanswers: [
            {
              index: "i",
              value: "Download the setup as per your hardware",
              subanswers: [
                {
                  index: "1",
                  value: "<a href='javascript:void(0)'>64 bit</a>",
                },
                {
                  index: "2",
                  value: "<a href='javascript:void(0)'>32 bit</a>",
                },
                {
                  index: "3",
                  value: "<a href='javascript:void(0)'>ARM 64 bit</a>",
                },
              ],
            },
            {
              index: "ii",
              value:
                "Install the setup in current user or all the users as per your need",
              subanswers: [],
            },
            {
              index: "iii",
              value:
                "Goto start search <strong>Remote Desktop</strong> application, run it",
              subanswers: [],
            },
            {
              index: "iv",
              value: "Click on <strong>Subscribe</strong> button",
              subanswers: [],
            },
            {
              index: "v",
              value: "Enter your username and password ",
              subanswers: [],
            },
          ],
        },
        {
          answer: { index: "c", value: " macOS" },
          subanswers: [
            {
              index: "i",
              value:
                "Download and install Microsoft Remote Client app from the App Store." +
                "<img class='imgClass' src='../../../assets/images/remote-desktop.jpg' alt='remote desktop' />",
              subanswers: [],
            },
            {
              index: "ii",
              value:
                "Subscribe to the feed using the Link provided by OfficeBCP team or your admin. Go to Workspace Tab, Click on add workspace.<img style='max-width: 500px;display: block;margin: 24px' src='../../../assets/images/works-space.jpg' alt'works space' />",
              subanswers: [],
            },
            {
              index: "iii",
              value:
                "<a href='javascript:void(0);'>https://docs.microsoft.com/en-in/azure/virtual-desktop/connect-macos</a>",
              subanswers: [],
            },
          ],
        },
        {
          answer: { index: "d", value: " Android" },
          subanswers: [
            {
              index: "i",
              value:
                "Download this <a href='javascript:void(0);'>application</a>",
              subanswers: [],
            },
            {
              index: "ii",
              value:
                "Subscribe feed, In the Connection Center, tap +, and then tap Remote Resource Feed",
              subanswers: [],
            },
            {
              index: "iii",
              value: "Enter email address as the feed URL ",
              subanswers: [],
            },
            {
              index: "iv",
              value: "Tap NEXT",
              subanswers: [],
            },
            {
              index: "v",
              value: "Provide your credentials when prompted",
              subanswers: [],
            },
            {
              index: "vi",
              value:
                "After that, the Connection Center should display the remote resources.",
              subanswers: [],
            },
            {
              index: "vii",
              value:
                "<a href='javascript:void(0);'>https://docs.microsoft.com/en-in/azure/virtual-desktop/connect-android</a>",
              subanswers: [],
            },
          ],
        },

        {
          answer: { index: "e", value: " iOS" },
          subanswers: [
            {
              index: "i",
              value:
                "Download this <a href='javascript:void(0);'>application</a>",
              subanswers: [],
            },
            {
              index: "ii",
              value:
                "<a href='javascript:void(0);'>https://docs.microsoft.com/en-in/azure/virtual-desktop/connect-ios</a>",
              subanswers: [],
            },
          ],
        },
      ],
    },
    {
      question: {
        index: "2",
        value: " How to request and ask for any support?",
      },
      answer: [
        {
          answer: {
            index: "a",
            value:
              "By using chat widget you can contact us anytime for any query or help",
          },
          subanswers: [],
        },
      ],
    },
    {
      question: {
        index: "3",
        value: " How to block certain websites?",
      },
      answer: [
        {
          answer: {
            index: "a",
            value:
              "By using chat widget you can contact us and we will do that for you",
          },
          subanswers: [],
        },
      ],
    },
    {
      question: {
        index: "4",
        value: " How to reset my password?",
      },
      answer: [
        {
          answer: {
            index: "a",
            value:
              "By using chat widget you can contact us and we will do that for you",
          },
          subanswers: [],
        },
      ],
    },
    {
      question: {
        index: "5",
        value: " How to reset the password of any user?",
      },
      answer: [
        {
          answer: {
            index: "a",
            value:
              "By using a chat widget you need to request a reset password of any user, we will set the temporary password and give it to you which user will be forced to change on the login.",
          },
          subanswers: [],
        },
      ],
    },
    {
      question: {
        index: "6",
        value: "How to share files once logged in with other employees?",
      },
      answer: [
        {
          answer: {
            index: "a",
            value: "Open My Computer ",
          },
          subanswers: [],
        },
        {
          answer: {
            index: "b",
            value: "Goto S-Shared drive and put any files there",
          },
          subanswers: [],
        },
        {
          answer: {
            index: "c",
            value:
              "All the employees will have this common drive to share such data across the organization",
          },
          subanswers: [],
        },
      ],
    },
    {
      question: {
        index: "7",
        value: " How to reset the password of any user?",
      },
      answer: [
        {
          answer: {
            index: "a",
            value:
              "Open one drive in your Machine, Mobile or any device to get your files",
          },
          subanswers: [],
        },
        {
          answer: {
            index: "b",
            value: "Do login with credentials provided by us",
          },
          subanswers: [],
        },
        {
          answer: {
            index: "c",
            value:
              "All the employees will have this common drive to share such data across the organization",
          },
          subanswers: [],
        },
      ],
    },
    {
      question: {
        index: "8",
        value: " How to chat and connect with the team members?",
      },
      answer: [
        {
          answer: {
            index: "a",
            value: "Open MS Teams to connect with any colleague",
          },
          subanswers: [],
        },
        {
          answer: {
            index: "b",
            value: "Do login with credentials provided by us",
          },
          subanswers: [],
        },
        {
          answer: {
            index: "c",
            value:
              "You can create additional groups to chat with group of people and share files also",
          },
          subanswers: [],
        },
      ],
    },
  ];
}
