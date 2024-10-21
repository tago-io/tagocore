function channelRegex(topic = "", ignoreHash = false) {
  let topicRegex: any;
  let topicMatch: any;

  topic = topic.trim();
  topic = topic.replace(/ /g, "");

  if (topic.endsWith("/#") && !ignoreHash) {
    topicMatch = topic.replace("/#", "/(?:.*)");
  }

  topicMatch = (topicMatch || topic).replace(/\+/g, "[^/]+");
  topicMatch = `^${topicMatch}$`;

  try {
    topicRegex = new RegExp(topicMatch);
  } catch (error) {
    topicRegex = /invalid_topic/;
  }

  return topicRegex;
}

export default channelRegex;
