// import { TestBed } from '@angular/core/testing';
// import { MessageBusService } from 'core';
// import { spyOnMessageBusMethods } from 'core/utils/testing';
// import { OperationsTrackerService } from './operations-tracker.service';

// describe('Service: OperationsTracker', () => {
//   let service: OperationsTrackerService;
//   let messageBusService: MessageBusService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [OperationsTrackerService, MessageBusService],
//     });
//   });

//   beforeEach(() => {
//     service = TestBed.inject(OperationsTrackerService);
//     messageBusService = TestBed.inject(MessageBusService);
//     spyOnMessageBusMethods(messageBusService);
//   });

//   it('should create', () => {
//     expect(service).toBeTruthy();
//   });

//   describe('#trackError', () => {
//     it('should send message to messageHub with proper key and error data if partition provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const error = new Error('some-error');
//       const partition = 'some-partition';

//       // Act
//       service.trackError(operationId, error, partition);

//       // Assert
//       expect(messageBusService.sendMessage).toHaveBeenCalledWith(`${partition}-${operationId}`, error);
//     });

//     it('should send message to messageHub with proper key and error data if partition not provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const error = new Error('some-error');

//       // Act
//       service.trackError(operationId, error);

//       // Assert
//       expect(messageBusService.sendMessage).toHaveBeenCalledWith(operationId, error);
//     });
//   });

//   describe('#trackSuccess', () => {
//     it('should send message to messageHub with proper key and null as data if partition provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const partition = 'some-partition';

//       // Act
//       service.trackSuccess(operationId, partition);

//       // Assert
//       expect(messageBusService.sendMessage).toHaveBeenCalledWith(`${partition}-${operationId}`, null);
//     });

//     it('should send message to messageHub with proper key and null as data if partition not provided', () => {
//       // Arrange
//       const operationId = 'some-operation';

//       // Act
//       service.trackSuccess(operationId);

//       // Assert
//       expect(messageBusService.sendMessage).toHaveBeenCalledWith(operationId, null);
//     });
//   });

//   describe('#trackSuccessWithData', () => {
//     it('should send message to messageHub with proper key and data if partition provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const partition = 'some-partition';
//       const data = { key: 'value' };

//       // Act
//       service.trackSuccessWithData(operationId, data, partition);

//       // Assert
//       expect(messageBusService.sendMessage).toHaveBeenCalledWith(`${partition}-${operationId}`, data);
//     });

//     it('should send message to messageHub with proper key and data if partition not provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const data = { key: 'value' };

//       // Act
//       service.trackSuccessWithData(operationId, data);

//       // Assert
//       expect(messageBusService.sendMessage).toHaveBeenCalledWith(operationId, data);
//     });
//   });

//   describe('#getOperationStatus', () => {
//     it('should call getObservable of message hub with proper key if partition provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const partition = 'some-partition';
//       const error = new Error('some-error');

//       // Act
//       messageBusService.sendMessage(`${partition}-${operationId}`, error);
//       service.getOperationStatus(operationId, partition);

//       // Assert
//       expect(messageBusService.getObservable).toHaveBeenCalledWith(`${partition}-${operationId}`);
//     });

//     it('should call getObservable of message hub with proper key if partition not provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const error = new Error('some-error');

//       // Act
//       messageBusService.sendMessage(operationId, error);
//       service.getOperationStatus(operationId);

//       // Assert
//       expect(messageBusService.getObservable).toHaveBeenCalledWith(operationId);
//     });
//   });

//   describe('#getOperationData', () => {
//     it('should call getObservable of message hub with proper key if partition provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const partition = 'some-partition';
//       const data = { key: 'value' };

//       // Act
//       messageBusService.sendMessage(`${partition}-${operationId}`, data);
//       service.getOperationData(operationId, partition);

//       // Assert
//       expect(messageBusService.getObservable).toHaveBeenCalledWith(`${partition}-${operationId}`);
//     });

//     it('should call getObservable of message hub with proper key if partition not provided', () => {
//       // Arrange
//       const operationId = 'some-operation';
//       const data = { key: 'value' };

//       // Act
//       messageBusService.sendMessage(operationId, data);
//       service.getOperationData(operationId);

//       // Assert
//       expect(messageBusService.getObservable).toHaveBeenCalledWith(operationId);
//     });
//   });
// });
