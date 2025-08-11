import { NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';

export async function findEntityOrFail<T extends ObjectLiteral>(
  repository: Repository<T>,
  id: string,
  entityName: string,
): Promise<T> {
  if (!id) {
    throw new NotFoundException(`${entityName} ID is required`);
  }

  const entity = await repository.findOneBy({ id } as any);
  if (!entity) {
    throw new NotFoundException(`${entityName} not found`);
  }

  return entity;
}