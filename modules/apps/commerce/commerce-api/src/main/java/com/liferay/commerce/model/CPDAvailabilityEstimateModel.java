/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.commerce.model;

import com.liferay.portal.kernel.bean.AutoEscape;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.MVCCModel;
import com.liferay.portal.kernel.model.ShardedModel;
import com.liferay.portal.kernel.model.StagedAuditedModel;

import java.util.Date;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The base model interface for the CPDAvailabilityEstimate service. Represents a row in the &quot;CPDAvailabilityEstimate&quot; database table, with each column mapped to a property of this class.
 *
 * <p>
 * This interface and its corresponding implementation <code>com.liferay.commerce.model.impl.CPDAvailabilityEstimateModelImpl</code> exist only as a container for the default property accessors generated by ServiceBuilder. Helper methods and all application logic should be put in <code>com.liferay.commerce.model.impl.CPDAvailabilityEstimateImpl</code>.
 * </p>
 *
 * @author Alessio Antonio Rendina
 * @see CPDAvailabilityEstimate
 * @generated
 */
@ProviderType
public interface CPDAvailabilityEstimateModel
	extends BaseModel<CPDAvailabilityEstimate>, MVCCModel, ShardedModel,
			StagedAuditedModel {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. All methods that expect a cpd availability estimate model instance should use the {@link CPDAvailabilityEstimate} interface instead.
	 */

	/**
	 * Returns the primary key of this cpd availability estimate.
	 *
	 * @return the primary key of this cpd availability estimate
	 */
	public long getPrimaryKey();

	/**
	 * Sets the primary key of this cpd availability estimate.
	 *
	 * @param primaryKey the primary key of this cpd availability estimate
	 */
	public void setPrimaryKey(long primaryKey);

	/**
	 * Returns the mvcc version of this cpd availability estimate.
	 *
	 * @return the mvcc version of this cpd availability estimate
	 */
	@Override
	public long getMvccVersion();

	/**
	 * Sets the mvcc version of this cpd availability estimate.
	 *
	 * @param mvccVersion the mvcc version of this cpd availability estimate
	 */
	@Override
	public void setMvccVersion(long mvccVersion);

	/**
	 * Returns the uuid of this cpd availability estimate.
	 *
	 * @return the uuid of this cpd availability estimate
	 */
	@AutoEscape
	@Override
	public String getUuid();

	/**
	 * Sets the uuid of this cpd availability estimate.
	 *
	 * @param uuid the uuid of this cpd availability estimate
	 */
	@Override
	public void setUuid(String uuid);

	/**
	 * Returns the cpd availability estimate ID of this cpd availability estimate.
	 *
	 * @return the cpd availability estimate ID of this cpd availability estimate
	 */
	public long getCPDAvailabilityEstimateId();

	/**
	 * Sets the cpd availability estimate ID of this cpd availability estimate.
	 *
	 * @param CPDAvailabilityEstimateId the cpd availability estimate ID of this cpd availability estimate
	 */
	public void setCPDAvailabilityEstimateId(long CPDAvailabilityEstimateId);

	/**
	 * Returns the company ID of this cpd availability estimate.
	 *
	 * @return the company ID of this cpd availability estimate
	 */
	@Override
	public long getCompanyId();

	/**
	 * Sets the company ID of this cpd availability estimate.
	 *
	 * @param companyId the company ID of this cpd availability estimate
	 */
	@Override
	public void setCompanyId(long companyId);

	/**
	 * Returns the user ID of this cpd availability estimate.
	 *
	 * @return the user ID of this cpd availability estimate
	 */
	@Override
	public long getUserId();

	/**
	 * Sets the user ID of this cpd availability estimate.
	 *
	 * @param userId the user ID of this cpd availability estimate
	 */
	@Override
	public void setUserId(long userId);

	/**
	 * Returns the user uuid of this cpd availability estimate.
	 *
	 * @return the user uuid of this cpd availability estimate
	 */
	@Override
	public String getUserUuid();

	/**
	 * Sets the user uuid of this cpd availability estimate.
	 *
	 * @param userUuid the user uuid of this cpd availability estimate
	 */
	@Override
	public void setUserUuid(String userUuid);

	/**
	 * Returns the user name of this cpd availability estimate.
	 *
	 * @return the user name of this cpd availability estimate
	 */
	@AutoEscape
	@Override
	public String getUserName();

	/**
	 * Sets the user name of this cpd availability estimate.
	 *
	 * @param userName the user name of this cpd availability estimate
	 */
	@Override
	public void setUserName(String userName);

	/**
	 * Returns the create date of this cpd availability estimate.
	 *
	 * @return the create date of this cpd availability estimate
	 */
	@Override
	public Date getCreateDate();

	/**
	 * Sets the create date of this cpd availability estimate.
	 *
	 * @param createDate the create date of this cpd availability estimate
	 */
	@Override
	public void setCreateDate(Date createDate);

	/**
	 * Returns the modified date of this cpd availability estimate.
	 *
	 * @return the modified date of this cpd availability estimate
	 */
	@Override
	public Date getModifiedDate();

	/**
	 * Sets the modified date of this cpd availability estimate.
	 *
	 * @param modifiedDate the modified date of this cpd availability estimate
	 */
	@Override
	public void setModifiedDate(Date modifiedDate);

	/**
	 * Returns the commerce availability estimate ID of this cpd availability estimate.
	 *
	 * @return the commerce availability estimate ID of this cpd availability estimate
	 */
	public long getCommerceAvailabilityEstimateId();

	/**
	 * Sets the commerce availability estimate ID of this cpd availability estimate.
	 *
	 * @param commerceAvailabilityEstimateId the commerce availability estimate ID of this cpd availability estimate
	 */
	public void setCommerceAvailabilityEstimateId(
		long commerceAvailabilityEstimateId);

	/**
	 * Returns the c product ID of this cpd availability estimate.
	 *
	 * @return the c product ID of this cpd availability estimate
	 */
	public long getCProductId();

	/**
	 * Sets the c product ID of this cpd availability estimate.
	 *
	 * @param CProductId the c product ID of this cpd availability estimate
	 */
	public void setCProductId(long CProductId);

	/**
	 * Returns the last publish date of this cpd availability estimate.
	 *
	 * @return the last publish date of this cpd availability estimate
	 */
	public Date getLastPublishDate();

	/**
	 * Sets the last publish date of this cpd availability estimate.
	 *
	 * @param lastPublishDate the last publish date of this cpd availability estimate
	 */
	public void setLastPublishDate(Date lastPublishDate);

	@Override
	public CPDAvailabilityEstimate cloneWithOriginalValues();

}