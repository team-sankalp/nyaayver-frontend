import RNFS from 'react-native-fs';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import React, {useContext, useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {launchCamera} from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {
  addUserMessage,
  addBotMessage,
  Message,
  addMediaMessage,
} from '../components/ChatUtils';

import Snackbar from 'react-native-snackbar';

import {AuthContext} from '../appwrite/AuthContext';
import {useAppContext} from '../AppContext';

import {fetchCases} from '../service/backend';

import {DrawerParamList} from '../routes/AppStack2';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import {AppState, AppStateStatus} from 'react-native';

import Drawer from '../components/ChatDrawer';
import NewCasePop from '../components/InputPopup';

const audioRecorderPlayer = new AudioRecorderPlayer();

type UserObj = {
  unique_id: String;
};

type HomeScreenProps = {
  navigation: DrawerNavigationProp<DrawerParamList, 'Home'>;
};

const Home: React.FC<HomeScreenProps> = ({navigation}) => {
  const {messages, setMessages, caseNumber, victimName, userData} = useAppContext();
  const { logout, userToken } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [newCaseVisible, setNewCaseVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const appState = useRef(AppState.currentState);
  
//   const parseBotMessageToObject = (text: string | undefined | null) => {
//     // Initialize empty object as fallback for invalid input
//     const result: {[key: string]: string | number} = {};
    
//     // Handle cases where text isn't a valid string
//     if (typeof text !== 'string' || !text) {
//         console.log("Invalid input - expected string but got:", text);
//         return result;
//     }

//     const lines = text.split('\n');
  
//     lines.forEach(line => {
//         const [key, ...valueParts] = line.split(':');
//         const value = valueParts.join(':').trim();
    
//         if (key && value) {
//             const trimmedKey = key.trim();
//             const parsedValue = isNaN(Number(value)) ? value : Number(value);
    
//             result[trimmedKey] = parsedValue;
//         }
//     });
  
//     console.log("Parsed Object", result);
//     return result;
// };
  

  const showDrawer = async() => {
    const data = await fetchCases(userData?.unique_id);
    setItemsData(data);
    setDrawerVisible(true);
  };

  const PlayPause = (uri: string) => {
    if (isPlaying) {
      audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } else {
      audioRecorderPlayer.startPlayer(uri);
      setIsPlaying(true);
    }
  };

  // const saveChatData = async () => {
  //   if(userData && caseNumber && victimName){
  //       console.log('Saving chat data...');
  //       const uniqueId = `${userData?.unique_id}`;        
  //       await saveMessages(messages, uniqueId);
  //   }
  // }

  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState: AppStateStatus) => {
  //     if (appState.current.match(/active/) && nextAppState === 'background') {
  //       saveChatData(); // Save data when app goes to background
  //     }
  //     appState.current = nextAppState;
  //   };

  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );

  //   return () => {
  //     subscription.remove(); // Cleanup listener on component unmount
  //   };
  // }, [messages]);

  const handleImagePress = (uri: string) => {
    setSelectedImage(uri);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleLogout = () => {
    logout().then(() => {
      Snackbar.show({
        text: 'Logout Successful',
        duration: Snackbar.LENGTH_SHORT,
      });
    });
  };

  const handleCameraPress = () => {
    launchCamera({mediaType: 'photo'}, async response => {
      if (response.didCancel || response.errorMessage) return;

      const imageUri = response.assets?.[0]?.uri;
      if (imageUri) {
        try {
          const base64IMG = await RNFS.readFile(imageUri, 'base64');

          addMediaMessage(
            `data:image/jpeg;base64,${base64IMG}`,
            setMessages,
            'image',
            userToken
          );

          setTimeout(() => {
            flatListRef.current?.scrollToEnd({animated: true});
          }, 500);
        } catch (error) {
          console.error('Error converting image to base64:', error);
          Snackbar.show({
            text: 'Failed to process image',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      }
    });
  };

  const handleMicPress = async () => {
    if (!isRecording) {
      try {
        // Start recording
        await audioRecorderPlayer.startRecorder();
        setIsRecording(true);

        audioRecorderPlayer.addRecordBackListener(e => {
          setRecordingTime(
            audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)),
          );
        });
      } catch (error) {
        console.error('Audio recording error:', error);
        Snackbar.show({
          text: 'Failed to start recording',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else {
      try {
        const uri = await audioRecorderPlayer.stopRecorder();
        setIsRecording(false);
        audioRecorderPlayer.removeRecordBackListener();
        setRecordingTime('');

        if (uri) {
          const base64Audio = await RNFS.readFile(uri, 'base64');

          addMediaMessage(
            `data:audio/m4a;base64,${base64Audio}`,
            setMessages,
            'audio',
            userToken
          );

          setTimeout(() => {
            flatListRef.current?.scrollToEnd({animated: true});
          }, 500);
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
        Snackbar.show({
          text: 'Failed to process audio',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    }
  };

  const handleSend = (
    input: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  ) => {
    if (input.trim() !== '') {
      addUserMessage(input, setMessages, userToken);
      setInput('');

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  };

  const renderItem = ({item}: {item: Message}) => {
    const isBotMessage = item.sender === 'bot';
    const tableData = isBotMessage && item.text ? (Array.isArray(item.text) ? item.text : []) : [];  
    return (
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}>
        {item.type === 'text' && item.sender === 'user' && (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
  
  {item.sender === 'bot' && tableData && (
        <View style={styles.tableContainer}>
          {tableData.map((entry: any, entryIndex: any) => (
            <View key={entryIndex} style={styles.entryContainer}>
              {/* Render each key-value pair in the object */}
              {Object.entries(entry).map(([key, value], index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableKey}>{key}:</Text>
                  <Text style={styles.tableValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
  
        {item.type === 'image' && (
          <TouchableOpacity onPress={() => handleImagePress(item.uri)}>
            <Image source={{uri: item.uri}} style={styles.mediaImage} />
          </TouchableOpacity>
        )}
  
        {item.type === 'audio' && (
          <TouchableOpacity onPress={() => PlayPause(item.uri)}>
            <Icon name="play-circle" size={30} color="black" />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <Icon 
            name="comment-o" 
            size={30} 
            color="black"
            onPress={() => showDrawer()}
          />
        </TouchableOpacity>
        {!caseNumber && 
          <View style={styles.warning}>
            <Text style={{color: 'red', fontWeight: 'bold'}}>
              Case Not Saved
            </Text>
          </View>
        }
        <TouchableOpacity>
          <Icon
            name="user-circle-o"
            size={35}
            color="black"
            onPress={() => navigation.toggleDrawer()}
          />
        </TouchableOpacity>
      </View>

      <ImageBackground
        source={require('../../assets/logo.png')} // Replace with your local image path
        style={styles.logo}
      />
      { drawerVisible && 
      <View style={styles.DrawerContainer}>
        <Drawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          itemsData={itemsData}
        />
      </View>}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={item => renderItem(item)}
        style={[drawerVisible? styles.messageListDown: styles.messageList]}
        contentContainerStyle={styles.chatContainer}
      />

      <NewCasePop
        visible={newCaseVisible}
        onClose={() => setNewCaseVisible(false)}
      />

      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeImageModal}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={
              selectedImage
                ? {uri: selectedImage}
                : require('../../assets/logo.png')
            }
            style={styles.fullImage}
          />
        </View>
      </Modal>

      <View style={[drawerVisible? styles.inputContainerDown: styles.inputContainer]}>
        <TextInput
          value={input}
          onChangeText={text => setInput(text)}
          style={[styles.input,]}
          placeholder="Ask Nyaayveer"
          placeholderTextColor="#000"
          onSubmitEditing={() => handleSend(input, setMessages)}
        />
        {!input && (
          <>
            {isRecording ? (
              <Text>{recordingTime}</Text>
            ) : (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleCameraPress}>
                <Icon name="camera" size={25} color="black" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleMicPress}>
              <Icon
                name={isRecording ? 'microphone-slash' : 'microphone'}
                size={25}
                color="black"
              />
            </TouchableOpacity>

          </>
        )}

        {input && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSend(input, setMessages)}>
            <Icon name="arrow-right" size={25} color="#fff" />
          </TouchableOpacity>
        )}
        {!input && (
        <TouchableOpacity onPress={() => setNewCaseVisible(true)}>
          <Icon
            name="plus-circle"
            size={30}
            color="black"
            style={styles.PlusButton}
          >
          </Icon>
        </TouchableOpacity>)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  entryContainer: {
    marginBottom: 16,  // Space between entries
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  headerIcons: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  logo: {
    width: 280,
    height: 300,
    resizeMode: 'center',
    opacity: 30,
    marginTop: '40%',
    position: 'absolute',
    elevation: -1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 50,
    paddingHorizontal: 10,
    width: '90%',
    height: 60,
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainerDown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 50,
    paddingHorizontal: 10,
    width: '0%',
    height: 0,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  iconButton: {
    marginHorizontal: 5,
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#00C853',
    borderRadius: 25,
    padding: 10,
  },
  PlusButton: {
    marginLeft: 8,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'yellow',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 6,
  },
  bottomContainerDown: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'yellow',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: -1,
  },
  messageList: {
    elevation: 5,
    width: '90%',
  },
  messageListDown:{
    elevation: -1,
    width: '0%',
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  DrawerContainer:{
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#ffd700",
    padding: 15,
    elevation: 11,
  },
  warning:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: 30,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageBubble: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '90%',
    backgroundColor: '#F1F0F0',
  },
  botBubble: {
    alignSelf: 'flex-start',
  },
  tableContainer: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  tableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 3,
  },
  tableKey: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  tableValue: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
  },
});

export default Home;