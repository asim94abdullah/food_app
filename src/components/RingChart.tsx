import * as React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Color, Fonts } from '../common/Constants';
import { CommonStyle } from '../common/Theme';

interface RingChartProps {
    progress: number
}



const chartWidth = Math.min(Dimensions.get('window').width / 2, 300)
const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};
const RingChart = ({ progress }: RingChartProps) => {
    return (
        <View style={styles.container}>
            {/* <ProgressChart
                data={{
                    labels: ["Remaining Stock"], // optional
                    data: [progress / 100],
                    // data: [0.8]
                }}
                width={chartWidth}
                height={220}
                strokeWidth={8}
                radius={70}
                chartConfig={chartConfig}
                hideLegend={true}
                style={{ transform: [{ rotate: '180deg' }] }}
            /> */}
            <Text style={styles.title}>Stock Available</Text>
            <Text style={styles.text}>{progress}</Text>
        </View>
    );
};

export default RingChart;

const styles = StyleSheet.create({
    container: {
        width: chartWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 12,
        color: Color.White,
        textAlign: 'center'
    },
    text: {
        fontSize: 28,
        color: Color.White,
        textAlign: 'center',
        fontFamily: Fonts.UniNeueBold,
    },
});
