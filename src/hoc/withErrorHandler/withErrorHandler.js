import React, { Component } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../_Aux/_Aux";

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
    };

    componentWillMount() {
      console.log("[withErrorHandler] componentDidMount");
      this.reqInterceptor = axios.interceptors.request.use((req) => {
        //clear errors
        console.log("[withErrorHandler] request");
        this.setState({ error: null });
        return req;
      });
      this.resInterceptor = axios.interceptors.response.use(
        //set errors
        (res) => res,
        (error) => {
          console.log("[withErrorHandler] error");
          this.setState({ error: error });
        }
      );
    }
    componentWillUnmount() {
      console.log("will unmount", this.reqInterceptor, this.resInterceptor);
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }
    errorConfirmedHandler = () => {
      //clear error, user clicked backgdrop
      this.setState({ error: null });
    };
    render() {
      return (
        <Aux>
          <Modal
            modalClosed={this.errorConfirmedHandler}
            show={this.state.error}
          >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
