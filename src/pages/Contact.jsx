
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    SendOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { submitContact } from '../api/ipoApi.js';

const { TextArea } = Input;

export default function Contact() {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Submit Contact Form
    const onFinish = async (values) => {
        if (submitting) return;

        setSubmitting(true);

        try {
            const payload = {
                fullName: values.fullName.trim(),
                email: values.email.trim().toLowerCase(),
                number: values.number.trim(),
                msg: values.msg.trim()
            };

            const res = await submitContact(payload);

            if (res?.success) {
                message.success('Your message has been sent successfully.');
                setSubmitted(true);
                form.resetFields();
            } else {
                message.error(
                    res?.message || 'Failed to send message. Please try again.'
                );
            }
        } catch (err) {
            console.error('Contact submit error:', err);
            message.error('Network error. Please try again in a few moments.');
        } finally {
            setSubmitting(false);
        }
    };

    // Full Name Validation
    const validateName = (_, value) => {
        const name = value?.trim() || '';

        if (!name) {
            return Promise.reject(
                new Error('Please enter your full name.')
            );
        }

        if (name.length < 2 || name.length > 100) {
            return Promise.reject(
                new Error('Name must be between 2 and 100 characters.')
            );
        }

        return Promise.resolve();
    };

    // Email Validation
    const validateEmail = (_, value) => {
        const email = value?.trim() || '';

        if (!email) {
            return Promise.reject(
                new Error('Please enter your email address.')
            );
        }

        if (
            email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return Promise.reject(
                new Error('Please enter a valid email address.')
            );
        }

        return Promise.resolve();
    };

    // Phone Validation - Exactly 10 Digits
    const validatePhone = (_, value) => {
        const phone = value || '';

        if (!phone) {
            return Promise.reject(
                new Error('Please enter your mobile number.')
            );
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return Promise.reject(
                new Error('Mobile number must be exactly 10 digits.')
            );
        }

        return Promise.resolve();
    };

    // Message Validation
    const validateMessage = (_, value) => {
        const msg = value?.trim() || '';

        if (!msg) {
            return Promise.reject(
                new Error('Please enter your message.')
            );
        }

        if (msg.length < 5 || msg.length > 5000) {
            return Promise.reject(
                new Error('Message must be between 5 and 5000 characters.')
            );
        }

        return Promise.resolve();
    };

    return (
        <div className="py-4 max-w-5xl mx-auto space-y-6">

            {/* Breadcrumb */}
            <div className="text-xs text-slate-500 font-medium">
                <Link to="/" className="text-slate-500 hover:text-[#056a42]">
                    Home
                </Link>

                <span className="mx-1.5 text-slate-400">&gt;</span>

                <span className="text-emerald-700 font-semibold">
                    Contact Us
                </span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0">
                    Get in Touch
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
                    Have questions about IPO listings, Grey Market Premium data,
                    feedback, or business inquiries? Drop us a message below and
                    our team will get back to you.
                </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                {/* Contact Information */}
                <div className="md:col-span-5 space-y-5">

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">

                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
                            Editorial & Support Desk
                        </h2>

                        <div className="space-y-3.5 text-xs text-slate-600">

                            {/* Location */}
                            <div className="flex items-start gap-3">
                                <EnvironmentOutlined className="text-[#056a42] text-sm mt-0.5" />

                                <div>
                                    <div className="font-semibold text-slate-800">
                                        Operational Base
                                    </div>

                                    <div className="text-slate-500">
                                        Mumbai / Ahmedabad, India
                                    </div>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="flex items-start gap-3">
                                <ClockCircleOutlined className="text-[#056a42] text-sm mt-0.5" />

                                <div>
                                    <div className="font-semibold text-slate-800">
                                        Market Coverage Hours
                                    </div>

                                    <div className="text-slate-500">
                                        Monday – Friday: 9:00 AM – 7:00 PM IST
                                    </div>

                                    <div className="text-slate-500">
                                        Saturday: 10:00 AM – 2:00 PM IST
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <MailOutlined className="text-[#056a42] text-sm mt-0.5" />

                                <div>
                                    <div className="font-semibold text-slate-800">
                                        Email Queries
                                    </div>

                                    <div className="text-slate-500">
                                        support@ipogmp.in
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* GMP Note */}
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-slate-600 space-y-1.5">

                        <div className="font-bold text-[#056a42]">
                            Note on Grey Market Data:
                        </div>

                        <div className="leading-relaxed text-slate-500">
                            Grey Market Premiums (GMP) and Kostak rates are compiled
                            for research purposes. We do not facilitate trades or
                            transactions in unregulated grey market securities.
                        </div>
                    </div>

                </div>

                {/* Contact Form */}
                <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs">

                    {submitted ? (

                        /* Success Message */
                        <div className="py-8 text-center space-y-3">

                            <CheckCircleFilled className="text-4xl text-emerald-600" />

                            <h3 className="text-lg font-bold text-slate-900 m-0">
                                Thank You!
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                                Your message has been received. Our team will review
                                your query and reply to your email address shortly.
                            </p>

                            <Button
                                type="primary"
                                onClick={() => setSubmitted(false)}
                                className="!mt-4 !bg-[#056a42]"
                            >
                                Send Another Message
                            </Button>

                        </div>

                    ) : (

                        /* Form */
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            validateTrigger={['onBlur', 'onChange']}
                            className="space-y-1"
                        >

                            {/* Full Name */}
                            <Form.Item
                                name="fullName"
                                label={
                                    <span className="text-xs font-semibold text-slate-700">
                                        Full Name
                                    </span>
                                }
                                rules={[
                                    { validator: validateName }
                                ]}
                            >
                                <Input
                                    placeholder="Your Name (e.g. Rahul Sharma)"
                                    prefix={
                                        <UserOutlined className="text-slate-400" />
                                    }
                                    size="large"
                                    maxLength={100}
                                    showCount
                                    className="!rounded-lg text-sm"
                                />
                            </Form.Item>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                {/* Email */}
                                <Form.Item
                                    name="email"
                                    label={
                                        <span className="text-xs font-semibold text-slate-700">
                                            Email Address
                                        </span>
                                    }
                                    rules={[
                                        { validator: validateEmail }
                                    ]}
                                >
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        prefix={
                                            <MailOutlined className="text-slate-400" />
                                        }
                                        size="large"
                                        maxLength={254}
                                        className="!rounded-lg text-sm"
                                    />
                                </Form.Item>

                                {/* Phone */}
                                <Form.Item
                                    name="number"
                                    label={
                                        <span className="text-xs font-semibold text-slate-700">
                                            Contact Number
                                        </span>
                                    }
                                    rules={[
                                        { validator: validatePhone }
                                    ]}
                                >
                                    <Input
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="10-digit mobile number"
                                        prefix={
                                            <PhoneOutlined className="text-slate-400" />
                                        }
                                        size="large"
                                        maxLength={10}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 10);

                                            form.setFieldValue('number', value);
                                        }}
                                        className="!rounded-lg text-sm"
                                    />
                                </Form.Item>

                            </div>

                            {/* Message */}
                            <Form.Item
                                name="msg"
                                label={
                                    <span className="text-xs font-semibold text-slate-700">
                                        Message / Inquiry
                                    </span>
                                }
                                rules={[
                                    { validator: validateMessage }
                                ]}
                            >
                                <TextArea
                                    placeholder="Write your question, suggestion, or inquiry here..."
                                    rows={4}
                                    maxLength={5000}
                                    showCount
                                    className="!rounded-lg text-sm"
                                />
                            </Form.Item>

                            {/* Submit Button */}
                            <Form.Item className="!mb-0 !pt-2">

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitting}
                                    disabled={submitting}
                                    icon={<SendOutlined />}
                                    size="large"
                                    block
                                    className="!bg-[#056a42] hover:!bg-[#045233] !rounded-lg !font-semibold !h-11 cursor-pointer"
                                >
                                    Send Message
                                </Button>

                            </Form.Item>

                        </Form>

                    )}

                </div>
            </div>
        </div>
    );
}
