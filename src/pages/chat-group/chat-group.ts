import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { Events, Content, TextInput } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";

import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { AddUserToGroupPage } from '../add-user-to-group/add-user-to-group';
import { GroupsPage } from '../groups/groups';
import { NotificationProvider } from '../../providers/notification/notification';
/**
 * Generated class for the ChatGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-chat-group',
    templateUrl: 'chat-group.html',
})
export class ChatGroupPage {

    @ViewChild(Content) content: Content;
    @ViewChild('chat_input') messageInput: TextInput;
    msgList: ChatMessage[] = [];
    user: UserInfo;
    toUser: UserInfo;
    editorMsg = '';
    showEmojiPicker = false;

    addinguser: object;
    groupmember: Array<{ id: any, name: string, avatar: string }>;
    notifi_length = 0
    constructor(public pushstate: NotificationProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public chatService: ChatService,
        public events: Events, ) {
        this.groupmember = [];
        this.addinguser = this.navParams.get('item');

        // Get the navParams toUserId parameter
        this.toUser = {
            // id: navParams.get('toUserId'),
            // name: navParams.get('toUserName')
            id: '210000198410281948',
            name: 'Hancock'
        };


        // Get mock user information
        this.chatService.getUserInfo()
            .then((res) => {
                this.user = res
            });


        this.groupmember.push({
            id: this.toUser.id,
            name: this.toUser.name,
            avatar: 'assets/img/myprofilestarterblank.png'
        });
        this.groupmember.push({
            id: '32452352',
            name: '234532452345',
            avatar: 'assets/to-user.jpg'
        });

        this.groupmember.push({
            id: this.navParams.get('item').id,
            name: this.navParams.get('item').name,
            avatar: this.navParams.data.item.avatar
        });
    }
    ionViewDidLoad() {
        /////////////////notification state
        this.notifi_length = 0;
        this.pushstate.getpushstate();

        let messageNotification = this.pushstate.notification;
        for (let i = 0; i < messageNotification.length; i++)
            this.notifi_length += messageNotification[i].cnt;
        ///////////////
        console.log('ionViewDidLoad DungeonListingPage');
        console.log(this.navParams);
    }

    ionViewWillLeave() {
        // unsubscribe
        this.events.unsubscribe('chat:received');
    }

    ionViewDidEnter() {
        //get message list
        this.getMsg()
            .then(() => {
                this.scrollToBottom();
            });

        // Subscribe to received  new message events
        this.events.subscribe('chat:received', msg => {
            this.pushNewMsg(msg);
        })
    }

    onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    }

    switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }
        this.content.resize();
        this.scrollToBottom();
    }

    /**
     * @name getMsg
     * @returns {Promise<ChatMessage[]>}
     */
    getMsg() {
        // Get mock message list
        return this.chatService
            .getMsgList()
            .then(res => {
                this.msgList = res;
            })
            .catch(err => {
                console.log(err)
            })
    }

    /**
     * @name sendMsg
     */
    sendMsg() {
        if (!this.editorMsg.trim()) return;

        // Mock message
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
            toUserId: this.toUser.id,
            time: Date.now(),
            message: this.editorMsg,
            status: 'pending'
        };

        this.pushNewMsg(newMsg);
        this.editorMsg = '';

        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }

        this.chatService.sendMsg(newMsg)
            .then(() => {
                let index = this.getMsgIndexById(id);
                if (index !== -1) {
                    this.msgList[index].status = 'success';
                }
            })
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        const userId = this.user.id,
            toUserId = this.toUser.id;
        // Verify user relationships
        if (msg.userId === userId && msg.toUserId === toUserId) {
            this.msgList.push(msg);
        } else if (msg.toUserId === userId && msg.userId === toUserId) {
            this.msgList.push(msg);
        }
        this.scrollToBottom();
    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
            }
        }, 400)
    }

    goMeetKinkSters() {
        this.navCtrl.push(MeetKinkStersPage);
    }
    goMessages() {
        this.navCtrl.push(MessagesPage);
    }
    goDungeonFinderWalkthorugh() {
        this.navCtrl.push(DungeonFinderWalkthorughPage);
    }
    goMenuSide() {
        this.navCtrl.push(MenuSidePage);
    }
    goAddGroup() {
        this.navCtrl.push(AddUserToGroupPage);

    }
    goGroups() {
        this.navCtrl.push(GroupsPage);
    }

}
