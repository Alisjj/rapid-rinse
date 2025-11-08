import React from "react";
import {
    View,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const ImageGallery = ({ images, selectedImage, setSelectedImage }) => (
    <View style={styles.imageContainer}>
        <Image
            source={{ uri: images[selectedImage] }}
            style={styles.mainImage}
        />
        <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailList}
            renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => setSelectedImage(index)}>
                    <Image
                        source={{ uri: item }}
                        style={[
                            styles.thumbnail,
                            selectedImage === index && styles.selectedThumbnail,
                        ]}
                    />
                </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    </View>
);

const styles = StyleSheet.create({
    imageContainer: {
        backgroundColor: "#fff",
    },
    mainImage: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
    },
    thumbnailList: {
        padding: 10,
    },
    thumbnail: {
        width: 60,
        height: 60,
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedThumbnail: {
        borderColor: "#4A90E2",
    },
});

export default ImageGallery;
