import * as React from 'react';
import { Text, View, StyleSheet, useWindowDimensions, } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { Color } from '../../common/Constants';
import Container from '../../components/Container';
import Header from '../../components/Header';
import MillInspectionHistory from './MillInspectionHistory';
import ShopInspectionHistory from './ShopInspectionHistory';

interface MyInspectionsProps { }

const MyInspections = (props: MyInspectionsProps) => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const routes = [
        { key: 'shopInpection', title: 'Shop Inpection' },
        { key: 'millInpection', title: 'Mill Inpection' },
    ];

    const renderScene = SceneMap({
        shopInpection: ShopInspectionHistory,
        millInpection: MillInspectionHistory,
    });


    return (
        <Container>
            <Header title='Inp' flat={true} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={props => <TabBar {...props}
                    indicatorStyle={{ backgroundColor: Color.White, }}
                    activeColor={Color.White}
                    inactiveColor={Color.White}
                    style={{ backgroundColor: Color.Blue, }}
                />}
                initialLayout={{ width: layout.width }}
            />
        </Container>
    );
};

export default MyInspections;

// const styles = StyleSheet.create({
//     tabBar: {
//         flexDirection: 'row',
//         // paddingTop: StatusBar.currentHeight,
//         backgroundColor: Color.Blue,
//     },
//     tabItem: {
//         flex: 1,
//         alignItems: 'center',
//         padding: 16,
//         backgroundColor: Color.Blue,
//         color: Color.White
//     },
// });
