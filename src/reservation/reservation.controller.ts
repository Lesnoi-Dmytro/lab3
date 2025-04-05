import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationStatus, Role, type Prisma } from '@prisma/client';
import { CurrentUser, RequiredRole } from 'src/auth/auth.guard';
import type { JwtUser } from 'src/classes/auth/jwt_user.class';
import { MessageResponse } from 'src/classes/message-response.class';
import { PageResponse } from 'src/classes/pagination/page-response.class';
import { SortOrder } from 'src/classes/pagination/sortable-request.class';
import { InitiatePaymentResponse } from 'src/classes/payment/initiate-payment-response.class';
import { CreateReservation } from 'src/classes/reservations/create-response.class';
import { ReservationFilters } from 'src/classes/reservations/reservation-filters.class';
import { ReservationResponse } from 'src/classes/reservations/reservation-response.class';
import { ReservationService } from 'src/reservation/reservation.service';

@ApiTags('Reservation')
@ApiBearerAuth()
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Get reservations page' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number',
    default: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Page limit',
    default: 10,
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'Sort field',
    example: 'issuedAt',
    required: false,
  })
  @ApiQuery({
    name: 'order',
    type: String,
    description: 'Sort order',
    enum: SortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    description: 'User id',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'carId',
    type: String,
    description: 'Car id',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: String,
    description: 'Reservation status',
    enum: ReservationStatus,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservations',
    type: PageResponse<ReservationResponse>,
  })
  @Get()
  public async getAllReservations(
    @Query() filters: ReservationFilters,
    @CurrentUser() user: JwtUser,
  ) {
    const reservationPage = await this.reservationService.getAllReservations(
      filters,
      user,
    );

    return new PageResponse(
      reservationPage.data.map((reservation) =>
        this.prepareResponse(reservation),
      ),
      reservationPage.total,
    );
  }

  @ApiOperation({ summary: 'Get reservation by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Reservation id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation',
    type: ReservationResponse,
  })
  @Get('/:id')
  public async getReservationsById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    const reservation = await this.reservationService.getReservationById(
      id,
      user,
    );

    if (reservation) {
      return this.prepareResponse(reservation);
    } else {
      return new MessageResponse('Reservation not found');
    }
  }

  @ApiOperation({ summary: 'Create reservation' })
  @ApiBody({
    type: CreateReservation,
    description: 'Reservation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation',
    type: ReservationResponse,
  })
  @RequiredRole(Role.USER)
  @Post()
  public async createReservation(
    @CurrentUser('id') id: number,
    @Body() reservation: CreateReservation,
  ) {
    return this.prepareResponse(
      await this.reservationService.createReservation(id, reservation),
    );
  }

  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Reservation id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation',
    type: ReservationResponse,
  })
  @Put('/:id/cancel')
  public async cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    const reservation = await this.reservationService.cancelReservation(
      id,
      user,
    );

    if (reservation) {
      return this.prepareResponse(reservation);
    } else {
      return new MessageResponse('Reservation not found');
    }
  }

  @ApiOperation({ summary: 'Confirm reservation' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Reservation id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation',
    type: ReservationResponse,
  })
  @RequiredRole(Role.ADMIN)
  @Put('/:id/confirm')
  public async confirmReservation(@Param('id', ParseIntPipe) id: number) {
    const reservation = await this.reservationService.confirmReservation(id);

    if (reservation) {
      return this.prepareResponse(reservation);
    } else {
      return new MessageResponse('Reservation not found');
    }
  }

  @ApiOperation({ summary: 'Pay reservation' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Reservation id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Initiate payment response',
    type: InitiatePaymentResponse,
  })
  @RequiredRole(Role.USER)
  @Post('/:id/pay/initiate')
  public async initiatePayment(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.initiatePayment(id);
  }

  @ApiOperation({ summary: 'Complete reservation' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Reservation id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation',
    type: ReservationResponse,
  })
  @RequiredRole(Role.ADMIN)
  @Put('/:id/complete')
  public async completePayment(@Param('id', ParseIntPipe) id: number) {
    const reservation = await this.reservationService.completeReservation(id);

    if (reservation) {
      return this.prepareResponse(reservation);
    } else {
      return new MessageResponse('Reservation not found');
    }
  }

  private prepareResponse(
    reservation: Prisma.ReservationGetPayload<{
      include: {
        car: { include: { brand: true } };
        user: { include: { user: true } };
        damageReport: { include: { photos: true; reporter: true } };
      };
    }>,
  ) {
    return new ReservationResponse(
      reservation,
      reservation.car,
      reservation.car.brand,
      reservation.user.user,
      reservation.user,
      reservation.damageReport || undefined,
      reservation.damageReport?.photos || undefined,
      reservation.damageReport?.reporter || undefined,
    );
  }
}
