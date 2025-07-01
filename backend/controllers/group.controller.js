import User from "../models/user.js";
import Group from "../models/Group.js";
import GroupRequest from "../models/GroupRequest.js";
import { StreamChat } from 'stream-chat';

// Initialize Stream Chat
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export async function createGroup(req, res) {
  try {
    const { groupName, desc, profilePic, learningLanguage } = req.body;
    const creatorId = req.user._id;

    // Create group in MongoDB
    const newGroup = new Group({
      groupName,
      desc: desc || "",
      profilePic: profilePic || "",
      learningLanguage: learningLanguage || "",
      createdBy: creatorId,
      members: [creatorId]
    });

    await newGroup.save();

    // Create Stream channel
    const channel = serverClient.channel('messaging', `group_${newGroup._id}`, {
      name: groupName,
      image: profilePic || '',
      members: [creatorId.toString()],
      created_by_id: creatorId.toString()
    });

    await channel.create();
    await channel.addMembers([creatorId.toString()]);

    // Store streamChannelId in MongoDB
    newGroup.streamChannelId = channel.id;
    await newGroup.save();

    res.status(201).json({
  success: true,
  message: 'Group created successfully',
  group: newGroup,
  channel: {
    id: channel.id,
    data: channel.data,
    type: channel.type
  }
});

  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating group',
      error: error.message
    });
  }
}

export async function getMyGroups(req, res) {
  try {
    const userId = req.user.id;

    const groups = await Group.find({
      members: userId
    })
      .populate('createdBy', 'username profilePic')
      .populate('members', 'username profilePic');

    res.status(200).json({
      success: true,
      groups
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching groups',
      error: error.message
    });
  }
}

export async function sendGroupRequest(req, res) {
  try {
    const groupId = req.params.id;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.members.includes(senderId)) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    const existing = await GroupRequest.findOne({
      group: groupId,
      sender: senderId,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Request already sent' });
    }

    const request = new GroupRequest({
      group: groupId,
      sender: senderId,
      recipient: group.createdBy,
      status: 'pending'
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: 'Group join request sent',
      request
    });
  } catch (error) {
    console.error('Error sending group request:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending group request',
      error: error.message
    });
  }
}

export async function acceptGroupRequest(req, res) {
  try {
    const requestId = req.params.id;
    const adminId = req.user._id;

    const request = await GroupRequest.findById(requestId)
      .populate('group')
      .populate('sender');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.recipient.toString() !== adminId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    request.status = 'accepted';
    await request.save();

    const group = await Group.findById(request.group._id);
    if (!group.members.includes(request.sender._id)) {
      group.members.push(request.sender._id);
      await group.save();
    }

    // Add member to stream channel
    const channel = serverClient.channel('messaging', `group_${group._id}`);
    await channel.addMembers([request.sender._id.toString()]);

    res.status(200).json({
      success: true,
      message: 'User added to group',
      group
    });
  } catch (error) {
    console.error('Error accepting group request:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting group request',
      error: error.message
    });
  }
}

export async function getGroupRequests(req, res) {
  try {
    const userId = req.user._id;

    const requests = await GroupRequest.find({
      recipient: userId,
      status: 'pending'
    })
      .populate('sender', 'username profilePic')
      .populate('group', 'groupName');

    res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching group requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group requests',
      error: error.message
    });
  }
}

export async function getOutgoingGroupReqs(req, res) {
  try {
    const userId = req.user._id;

    const requests = await GroupRequest.find({
      sender: userId,
      status: 'pending'
    })
      .populate('recipient', 'username profilePic')
      .populate('group', 'groupName');

    res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching outgoing requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching outgoing requests',
      error: error.message
    });
  }
}
