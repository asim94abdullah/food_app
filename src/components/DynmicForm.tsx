import React, {useImperativeHandle, forwardRef} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {Button, Card, Text} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import {Color, Fonts, InputType} from '../common/Constants';
import {CommonStyle} from '../common/Theme';
import {TypeDropdownItem, TypeFile, TypeFormField} from '../common/Type';
import FileUploader from './FileUploader';
import RadioButton from './RadioButton';
import Dropdown from './Dropdown';

class DynmicForm extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      discardedItems: [{itemName: '', itemQty: ''}],
      seizedItems: [{item: undefined, itemQty: ''}],
    };
  }

  componentDidMount() {
    this.props.fields.forEach(field => {
      try {
        if (field.type.title == InputType.RadioButton) {
          const option = field?.options?.find(
            o =>
              o?.title?.toLowerCase() == field?.expected_value?.toLowerCase(),
          );
          this.setState({[field.id]: option?.id});
        } else {
          this.setState({[field.id]: field.expected_value});
        }
      } catch (error) {}
    });
  }

  render(): React.ReactNode {
    return (
      <View style={styles.content}>{this.renderFields(this.props.fields)}</View>
    );
  }

  getData() {
    // console.log('getting-data');
    return this.state;
  }

  clearData() {
    this.props.fields.forEach(field => {
      this.setState({[field.id]: undefined});
    });
  }

  /**
   * Renders the fields of a form.
   *
   * @param {TypeFormField[]} form - an array of TypeFormField objects representing the form fields
   * @return {any[]} an array of data obtained from the form fields
   */
  renderFields(form: TypeFormField[]) {
    const data = [];
    form.forEach(field => {
      // console.log('Fieldddd', field);

      data.push(this.getField(field));
    });
    return data;
  }

  updateAttachments(file?: TypeFile, index?: any, fieldId: string) {
    let attachments: [] = this.state[fieldId];
    if (file) {
      attachments.push(file);
    } else if (index != undefined) {
      attachments.splice(index, 1);
    }
    this.setState({[fieldId]: attachments});
  }

  getField(field: TypeFormField) {
    // if (!field) {
    //     console.log('field', field)
    //     return <></>
    // }
    let val = this.state[field.id];
    switch (field.type.title) {
      case InputType.TextField:
        return (
          <>
            <Text style={styles.lbl}>{field.title}</Text>
            <TextInput
              // mode="flat"
              // label={field.title}
              placeholder={field.placeholder}
              value={val || ''}
              onChangeText={text => this.setState({[field.id]: text})}
              style={styles.txtInput}
              returnKeyType="done"
            />
          </>
        );

      case InputType.Paragraph:
        return (
          <>
            <Text style={styles.lbl}>{field.title}</Text>
            <TextInput
              // mode="flat"
              // label={field.title}
              placeholder={field.placeholder}
              value={val || ''}
              numberOfLines={5}
              onChangeText={text => this.setState({[field.id]: text})}
              style={[styles.txtInput, {textAlignVertical: 'top'}]}
              returnKeyType="done"
            />
          </>
        );

      case InputType.Number:
        return (
          <>
            <Text style={styles.lbl}>{field.title}</Text>
            <TextInput
              // mode="flat"
              // label={field.title}
              placeholder={field.placeholder}
              value={val || ''}
              onChangeText={text => this.setState({[field.id]: text})}
              style={styles.txtInput}
              returnKeyType="done"
              keyboardType="number-pad"
            />
          </>
        );

      case InputType.RadioButton:
        return (
          <View style={styles.input}>
            <Text style={styles.label}>{field.title}</Text>
            {this.getRadioButtons(field.options, field.id, val)}
          </View>
        );

      case InputType.File:
        return (
          <FileUploader
            field={field}
            files={val}
            style={styles.input}
            updateFiles={this.updateAttachments}
          />
        );

      case InputType.MultipleItemTxtQtyTxt:
        return this.getMultipleTextItems(field.id, val);

      case InputType.MultipleItemDropDownQtyTxt:
        return this.getMultipleDropdownItems(field.id, val);

      default:
        return <></>;
    }
  }

  getRadioButtons(
    options: TypeDropdownItem[],
    fieldId: string,
    val?: string,
  ): any[] {
    const btns = [];
    options.forEach(option => {
      btns.push(
        <RadioButton
          label={option.title}
          checked={val == option.id}
          style={styles.radioBtn}
          // it save id in state; to save value (Yes/No) use option.title
          onPress={() => this.setState({[fieldId]: option.id})}
        />,
      );
    });
    return btns;
  }

  onDiscardItemNameChange(index: number, val: string) {
    try {
      const items = [...this.state.discardedItems];
      items[index] = {...items[index], itemName: val};
      this.setState({discardedItems: items});
    } catch (error) {
      console.log('error', error);
    }
  }

  onDiscardItemQtyChange(index: number, val: string) {
    try {
      const items = [...this.state.discardedItems];
      items[index] = {...items[index], itemQty: val};
      this.setState({discardedItems: items});
    } catch (error) {
      console.log('error', error);
    }
  }

  onAddDiscardItem() {
    try {
      const items = [...this.state.discardedItems];
      items.push({itemName: '', itemQty: ''});
      this.setState({discardedItems: items});
    } catch (error) {
      console.log('error', error);
    }
  }

  onRemoveDiscardItem = (index: number) => {
    try {
      const items = [...this.state.discardedItems];
      if (items.length <= 1) {
        Alert.alert('Message', 'Atleast one item is required');
      } else {
        items.splice(index, 1);
        this.setState({discardedItems: items});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  getMultipleTextItems(fieldId: string, val?: string): any[] {
    const rows: any[] = [];
    // { itemName: '', itemQty: '' },
    this.state.discardedItems.map((item, index) => {
      rows.push(
        <View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Item {index + 1}</Text>
            <TouchableOpacity onPress={() => this.onRemoveDiscardItem(index)}>
              <Text style={styles.lblRed}>Remove</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder={'Name'}
            value={item.itemName || ''}
            onChangeText={text => this.onDiscardItemNameChange(index, text)}
            style={[styles.txtInput, {marginBottom: 20}]}
            returnKeyType="done"
          />

          <TextInput
            placeholder={'Quantity'}
            value={item.itemQty || ''}
            onChangeText={text => this.onDiscardItemQtyChange(index, text)}
            style={styles.txtInput}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>,
      );
    });

    return (
      <Card style={styles.card}>
        <Card.Content>
          {rows}
          <Button
            mode="contained"
            style={styles.btn}
            onPress={this.onAddDiscardItem.bind(this)}>
            Add another item
          </Button>
        </Card.Content>
      </Card>
    );
  }

  onSeizedItemNameChange(index: number, item: any) {
    try {
      const items = [...this.state.seizedItems];
      items[index] = {...items[index], item: item};
      this.setState({seizedItems: items});
    } catch (error) {
      console.log('error', error);
    }
  }

  onSeizedItemQtyChange(index: number, val: string) {
    try {
      const items = [...this.state.seizedItems];
      items[index] = {...items[index], itemQty: val};
      this.setState({seizedItems: items});
    } catch (error) {
      console.log('error', error);
    }
  }

  onAddSeizedItem() {
    try {
      const items = [...this.state.seizedItems];
      items.push({itemName: '', itemQty: ''});
      this.setState({seizedItems: items});
    } catch (error) {
      console.log('error', error);
    }
  }

  onRemoveSeizedItem = (index: number) => {
    try {
      const items = [...this.state.seizedItems];
      if (items.length <= 1) {
        Alert.alert('Message', 'Atleast one item is required');
      } else {
        items.splice(index, 1);
        this.setState({seizedItems: items});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  getMultipleDropdownItems(fieldId: string, val?: string): any[] {
    const rows: any[] = [];
    const {extraData} = this.props;
    // { item: undefined, itemQty: '' },
    this.state.seizedItems.map((item, index) => {
      rows.push(
        <View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Item {index + 1}</Text>
            <TouchableOpacity onPress={() => this.onRemoveSeizedItem(index)}>
              <Text style={styles.lblRed}>Remove</Text>
            </TouchableOpacity>
          </View>
          {/* <TextInput
                        placeholder={"Name"}
                        value={item.itemName || ""}
                        onChangeText={text => this.onDiscardItemNameChange(index, text)}
                        style={[styles.txtInput, { marginBottom: 20 }]}
                        returnKeyType='done'
                    /> */}
          <Dropdown
            data={extraData?.seized_items || []}
            onItemSelect={i => this.onSeizedItemNameChange(index, i)}
            label="Select Item"
            value={item.item}
            style={styles.input}
          />

          <TextInput
            placeholder={'Quantity'}
            value={item.itemQty || ''}
            onChangeText={text => this.onSeizedItemQtyChange(index, text)}
            style={styles.txtInput}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>,
      );
    });

    return (
      <Card style={styles.card}>
        <Card.Content>
          {rows}
          <Button
            mode="contained"
            style={styles.btn}
            onPress={this.onAddSeizedItem.bind(this)}>
            Add another item
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  input: {
    marginBottom: moderateScale(40),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  txtInput: {
    padding: 20,
    marginBottom: moderateScale(40),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: Color.textLight,
  },
  lbl: {
    fontSize: 12,
    color: Color.textDark,
    marginBottom: 5,
  },
  lblRed: {
    fontSize: 12,
    color: Color.Red,
    marginBottom: 5,
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioBtn: {
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  card: {
    marginBottom: 10,
  },
});
export default DynmicForm;
