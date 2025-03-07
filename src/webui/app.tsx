import React, { ChangeEvent, useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { ChefView } from './components/chef';
import { UserView } from './components/user';

export default function App() {

  const [ view, setView ] = useState<string>('');

  const onChangeView = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    const { value } = ev.target;
    setView(value);
  }, []);

  return (
    <Container>
      <h2>Awesome Pizza</h2>
      <Row className="d-flex justify-content-end">
        <Col className="col-md-4">
          <label>Choose view:</label>
          <select onChange={(ev) => onChangeView(ev)} defaultValue={view}>
            <option value=""></option>
            <option value="chef">Chef</option>
            <option value="user1">user1</option>
            <option value="user2">user2</option>
            <option value="user3">user3</option>
          </select>
        </Col>
      </Row>
      <hr />
      {view == 'chef' && (<ChefView />)}
      {view.startsWith('user') && (<UserView user={view} />)}
    </Container>
  )
}