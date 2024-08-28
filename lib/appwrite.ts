import { Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage
 } from "react-native-appwrite"

export const appwriteConfig ={
    endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.techcontractor.aoura",
  projectId: "66ce130b0033104819f3",
  storageId: "66ce181400369c7eaf4d",
  databaseId: "66ce14fe00358e9b7df5",
  userCollectionId: "66ce1574000d5b967dfd",
  videoCollectionId: "66ce159c0027c09737ee",
}

const client = new Client();

client
.setEndpoint(appwriteConfig.endpoint)
.setProject(appwriteConfig.projectId)
.setPlatform(appwriteConfig.platform)

const account = new Account(client)
const storage = new Storage(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
//register user logic
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}


//sign in logics

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email,password)

    return session;
  } catch (error) {
    throw new Error(error);
  }
}