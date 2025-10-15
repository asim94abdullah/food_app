import * as React from 'react';
import { Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import WheatList from './WheatList';
import AttaList from './AttaList';
import { Color } from '../../../common/Constants';

interface CheckPostActiveListProps { }

const CheckPostActiveList = (props: CheckPostActiveListProps) => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const routes = [
        { key: 'wheat', title: 'Wheat' },
        { key: 'atta', title: 'Atta' },
    ];

    const renderScene = SceneMap({
        wheat: WheatList,
        atta: AttaList,
    });

    return (
        <Container>
            <Header title='Active Transits' flat={true} />
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

export default CheckPostActiveList;

// const styles = StyleSheet.create({
//     container: {}
// });
