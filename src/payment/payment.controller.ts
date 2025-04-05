import { PaymentService } from './payment.service';
import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentDetailsResponse } from 'src/classes/payment/payment-details-response.class';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Complete payment' })
  @ApiParam({ name: 'id', description: 'Payment Id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Payment completed',
    type: PaymentDetailsResponse,
  })
  @Post('/:id')
  public completePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.completePayment(id);
  }
}
