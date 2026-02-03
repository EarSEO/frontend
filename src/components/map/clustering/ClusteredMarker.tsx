// ref. https://github.com/tomekvenits/react-native-map-clustering.git

import React, { memo } from "react";

import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Marker, MarkerPressEvent} from "react-native-maps";

import { returnMarkerStyle } from "./helpers";

interface ClusterGeometry {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

interface ClusterProperties {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string;
}

interface ClusteredMarkerProps {
  geometry: ClusterGeometry;
  properties: ClusterProperties;
  onPress: (event: MarkerPressEvent) => void;
  clusterColor: string;
  clusterTextColor: string;
  clusterFontFamily?: string;
  tracksViewChanges?: boolean;
}

const ClusteredMarker = ({
    geometry,
    properties,
    onPress,
    clusterColor,
    clusterTextColor,
    clusterFontFamily,
    tracksViewChanges,
  }: ClusteredMarkerProps) => {
  const points = properties.point_count;
  const { width, height, fontSize, size } = returnMarkerStyle(points);

  return (
    <Marker
      key={`${geometry.coordinates[0]}_${geometry.coordinates[1]}`}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      style={{ zIndex: points + 1 }}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.container, { width, height }]}
      >
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: clusterColor,
              width,
              height,
              borderRadius: width / 2,
            },
          ]}
        />
        <View
          style={[
            styles.cluster,
            {
              backgroundColor: clusterColor,
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                color: clusterTextColor,
                fontSize,
                fontFamily: clusterFontFamily,
              },
            ]}
          >
            {points}
          </Text>
        </View>
      </TouchableOpacity>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    position: "absolute",
    opacity: 0.5,
    zIndex: 0,
  },
  cluster: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  text: {
    fontWeight: "bold",
  },
});

export default memo(ClusteredMarker);
